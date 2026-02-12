import { useEffect, useRef, useState, useCallback } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, CameraOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
  onScanError?: (error: string) => void;
  isActive: boolean;
  onClose: () => void;
}

export function QRScanner({ onScanSuccess, onScanError, isActive, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const [codeReader, setCodeReader] = useState<BrowserMultiFormatReader | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopScanning = useCallback(() => {
    if (codeReader) {
      // The BrowserMultiFormatReader doesn't have a direct stop method
      // We'll create a new instance when needed instead
      setCodeReader(null);
    }
    
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsScanning(false);
  }, [codeReader, stream]);

  const requestCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      // Store the stream to stop it later
      setStream(stream);
      setHasPermission(true);
      toast.success("Camera access granted!");
      return true;
    } catch (err) {
      console.error("Camera permission denied:", err);
      setHasPermission(false);
      
      let errorMessage = "Camera access denied";
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage = "Camera permission denied. Please allow camera access and try again.";
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found on this device.";
        } else if (err.name === "NotSupportedError") {
          errorMessage = "Camera not supported on this device.";
        }
      }
      
      setError(errorMessage);
      onScanError?.(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  }, [onScanError]);

  const initializeScanner = useCallback(async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const errorMsg = "Camera not supported on this browser";
      setError(errorMsg);
      onScanError?.(errorMsg);
      toast.error(errorMsg);
      return;
    }

    const hasAccess = await requestCameraPermission();
    if (!hasAccess) return;

    try {
      const reader = new BrowserMultiFormatReader();
      setCodeReader(reader);

      if (videoRef.current && stream) {
        videoRef.current.srcObject = stream;
        setIsScanning(true);
        
        // Start scanning
        reader.decodeFromVideoDevice(undefined, videoRef.current, (result, error) => {
          if (result) {
            const scannedText = result.getText();
            console.log("QR Code scanned:", scannedText);
            onScanSuccess(scannedText);
            toast.success("QR Code scanned successfully!");
            stopScanning();
          }
          
          // Only log non-NotFoundException errors to avoid spam
          if (error && error.name !== 'NotFoundException') {
            console.error("Scanning error:", error);
          }
        });
      }
    } catch (err) {
      console.error("Scanner initialization error:", err);
      const errorMsg = "Failed to initialize QR scanner";
      setError(errorMsg);
      onScanError?.(errorMsg);
      toast.error(errorMsg);
    }
  }, [requestCameraPermission, onScanSuccess, onScanError, stream]);

  useEffect(() => {
    if (isActive) {
      initializeScanner();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [isActive, initializeScanner, stopScanning]);

  const handleRetry = useCallback(() => {
    setError("");
    setHasPermission(null);
    initializeScanner();
  }, [initializeScanner]);

  if (!isActive) {
    return null;
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Scan QR Code</h3>
            <p className="text-sm text-muted-foreground">
              Point your camera at the QR code on the medicine package
            </p>
          </div>

          {/* Camera Permission Status */}
          {hasPermission === null && (
            <div className="flex items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Camera className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm text-blue-800">Requesting camera access...</span>
            </div>
          )}

          {hasPermission === false && (
            <div className="space-y-3">
              <div className="flex items-center justify-center p-4 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                <span className="text-sm text-red-800">{error}</span>
              </div>
              <Button onClick={handleRetry} className="w-full">
                <Camera className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          )}

          {/* Video Preview */}
          {hasPermission && (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full h-64 bg-black rounded-lg object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-white rounded-lg relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                </div>
              </div>

              {/* Scanning Status */}
              {isScanning && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="flex items-center bg-black/70 text-white px-3 py-2 rounded-full text-sm">
                    <div className="animate-pulse w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    Scanning...
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            {hasPermission && !isScanning && (
              <Button onClick={initializeScanner} className="flex-1">
                <Camera className="h-4 w-4 mr-2" />
                Start Scanning
              </Button>
            )}
          </div>

          {/* Instructions */}
          {hasPermission && (
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center text-green-600">
                <CheckCircle2 className="h-4 w-4 mr-1" />
                <span className="text-sm">Camera ready</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Position the QR code within the frame above
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

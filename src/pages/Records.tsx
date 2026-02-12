import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Upload, Filter, Download, Eye, Calendar, Building2, X, Shield, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { formatABHANumber, maskABHANumber } from "@/lib/abha";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { addSampleRecordsIfEmpty } from "@/lib/sampleRecords";

const STORAGE_KEY = "medination_records_by_vid";

type MedicalRecord = {
  id: string;
  vid: string;
  hospitalName: string;
  hospitalId: string;
  uploadedAt: string;
  fileName: string;
  fileType: string;
  fileDataUrl: string;
};

export default function Records() {
  const { isAuthenticated, user } = useAuth();
  const [query, setQuery] = useState("");
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    if (!user?.vid) return;
    
    // Add sample records if user has no records
    addSampleRecordsIfEmpty(user.vid);
    
    // Load records
    try {
      const index = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
      const list = Array.isArray(index[user.vid]) ? index[user.vid] : [];
      setRecords(list);
    } catch {
      setRecords([]);
    }
  }, [user?.vid]);

  const getRecordCategory = (fileName: string, fileType: string) => {
    const name = fileName.toLowerCase();
    if (name.includes('lab') || name.includes('test') || name.includes('blood')) return 'Lab Reports';
    if (name.includes('prescription') || name.includes('rx')) return 'Prescriptions';
    if (name.includes('scan') || name.includes('xray') || name.includes('mri') || name.includes('ct')) return 'Imaging';
    if (name.includes('discharge') || name.includes('summary')) return 'Discharge';
    if (name.includes('vaccine') || name.includes('immunization')) return 'Vaccination';
    return 'General';
  };

  const categorizedRecords = useMemo(() => {
    const categories: { [key: string]: MedicalRecord[] } = { 
      'Lab Reports': [],
      'Prescriptions': [],
      'Imaging': [],
      'Discharge': [],
      'Vaccination': [],
      'General': []
    };
    
    records.forEach(record => {
      const category = getRecordCategory(record.fileName, record.fileType);
      categories[category].push(record);
    });
    
    return categories;
  }, [records]);

  const filtered = useMemo(() => {
    let result = records;
    
    if (categoryFilter !== 'all') {
      result = result.filter(r => getRecordCategory(r.fileName, r.fileType) === categoryFilter);
    }
    
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((r) =>
        (r.hospitalName || "").toLowerCase().includes(q) ||
        (r.fileName || "").toLowerCase().includes(q) ||
        (r.fileType || "").toLowerCase().includes(q)
      );
    }
    
    return result.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [records, query, categoryFilter]);

  const recentRecords = useMemo(() => {
    return [...records]
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())
      .slice(0, 3);
  }, [records]);

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'Lab Reports': return '🧪';
      case 'Prescriptions': return '💊';
      case 'Imaging': return '🔬';
      case 'Discharge': return '📋';
      case 'Vaccination': return '💉';
      default: return '📄';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Lab Reports': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'Prescriptions': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Imaging': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'Discharge': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'Vaccination': return 'bg-pink-500/10 text-pink-600 border-pink-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-primary/5">
      <Navbar />
      
      <main className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Medical Records
            </h1>
            <p className="text-muted-foreground">View and manage your health documents securely</p>
            
            {/* ABHA ID Information */}
            {user?.abhaProfile && (
              <div className="mt-4 flex flex-wrap gap-3">
                <Badge variant="secondary" className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  ABHA: {maskABHANumber(user.abhaProfile.abhaNumber)}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-2">
                  <User className="h-3 w-3" />
                  {user.abhaProfile.abhaAddress}
                </Badge>
              </div>
            )}
          </div>
          <Button onClick={() => {
            if (!user?.vid) return;
            try {
              const index = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
              const list = Array.isArray(index[user.vid]) ? index[user.vid] : [];
              setRecords(list);
              toast.success("Synced records from hospital portal");
            } catch {
              toast.error("Failed to sync records");
            }
          }}>
            <Upload className="h-4 w-4 mr-2" />
            Sync Records
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{records.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Records</p>
              </div>
            </CardContent>
          </Card>
          {Object.entries(categorizedRecords).slice(0, 3).map(([category, items]) => (
            <Card key={category} className="border-primary/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-3xl font-bold">{items.length}</p>
                  <p className="text-sm text-muted-foreground mt-1">{category}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Records */}
        {recentRecords.length > 0 && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Recent Records
              </CardTitle>
              <CardDescription>Your latest medical documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {recentRecords.map((record) => {
                  const category = getRecordCategory(record.fileName, record.fileType);
                  return (
                    <Card key={record.id} className="hover:shadow-lg transition-all cursor-pointer border-2" onClick={() => setSelectedRecord(record)}>
                      <CardContent className="pt-6">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-2xl">{getCategoryIcon(category)}</span>
                            <Badge className={getCategoryColor(category)}>{category}</Badge>
                          </div>
                          <div>
                            <h3 className="font-semibold truncate">{record.fileName}</h3>
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {record.hospitalName}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(record.uploadedAt).toLocaleDateString('en-IN', { 
                                day: 'numeric', 
                                month: 'short', 
                                year: 'numeric' 
                              })}
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full" onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by hospital, file name, or type..." className="pl-9" />
              </div>
              <Tabs value={categoryFilter} onValueChange={setCategoryFilter} className="w-full md:w-auto">
                <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Lab Reports">Labs</TabsTrigger>
                  <TabsTrigger value="Prescriptions">Rx</TabsTrigger>
                  <TabsTrigger value="Imaging">Scans</TabsTrigger>
                  <TabsTrigger value="Discharge">Discharge</TabsTrigger>
                  <TabsTrigger value="Vaccination">Vaccines</TabsTrigger>
                  <TabsTrigger value="General">Other</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardContent>
        </Card>

        {/* All Records */}
        <div className="grid gap-4">
          {filtered.length === 0 && (
            <Card>
              <CardContent className="py-16 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No records found</p>
                <p className="text-sm text-muted-foreground">
                  {records.length === 0 
                    ? "Ask your hospital to upload documents using your VID."
                    : "Try adjusting your search or filter criteria."}
                </p>
              </CardContent>
            </Card>
          )}
          {filtered.map((record) => {
            const category = getRecordCategory(record.fileName, record.fileType);
            return (
              <Card key={record.id} className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-primary" onClick={() => setSelectedRecord(record)}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-4 flex-1 min-w-0">
                      <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 text-2xl">
                        {getCategoryIcon(category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-lg truncate">{record.fileName}</h3>
                            <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Building2 className="h-4 w-4" />
                                {record.hospitalName}
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                {new Date(record.uploadedAt).toLocaleDateString('en-IN', { 
                                  day: 'numeric', 
                                  month: 'long', 
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                          </div>
                          <Badge className={getCategoryColor(category)}>{category}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Button variant="outline" size="sm" onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRecord(record);
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <a
                        className="inline-flex"
                        href={record.fileDataUrl}
                        target="_blank"
                        rel="noreferrer"
                        download={record.fileName || 'record'}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button variant="secondary" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Document Preview Dialog */}
      <Dialog open={!!selectedRecord} onOpenChange={(open) => !open && setSelectedRecord(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-10">{selectedRecord?.fileName}</span>
            </DialogTitle>
            <DialogDescription>
              <div className="flex flex-wrap gap-3 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <Building2 className="h-4 w-4" />
                  {selectedRecord?.hospitalName}
                </span>
                <span className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  {selectedRecord && new Date(selectedRecord.uploadedAt).toLocaleDateString('en-IN', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </span>
                <Badge className={selectedRecord ? getCategoryColor(getRecordCategory(selectedRecord.fileName, selectedRecord.fileType)) : ''}>
                  {selectedRecord && getRecordCategory(selectedRecord.fileName, selectedRecord.fileType)}
                </Badge>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto border rounded-lg bg-muted/30 p-4">
            {selectedRecord && (
              selectedRecord.fileType.startsWith('image/') ? (
                <img 
                  src={selectedRecord.fileDataUrl} 
                  alt={selectedRecord.fileName}
                  className="max-w-full h-auto mx-auto rounded-lg shadow-lg"
                />
              ) : selectedRecord.fileType === 'application/pdf' ? (
                <iframe 
                  src={selectedRecord.fileDataUrl} 
                  className="w-full h-[60vh] rounded-lg"
                  title={selectedRecord.fileName}
                />
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Preview not available for this file type</p>
                  <a
                    href={selectedRecord.fileDataUrl}
                    download={selectedRecord.fileName}
                    className="inline-flex"
                  >
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </a>
                </div>
              )
            )}
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setSelectedRecord(null)}>Close</Button>
            {selectedRecord && (
              <a
                href={selectedRecord.fileDataUrl}
                download={selectedRecord.fileName}
                className="inline-flex"
              >
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </a>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

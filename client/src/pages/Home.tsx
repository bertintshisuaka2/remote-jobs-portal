import { Badge } from "@/components/ui/badge";
import DocumentEditor from "@/components/DocumentEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_TITLE } from "@/const";
import { Briefcase, DollarSign, Download, ExternalLink, Eye, FileText, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  description: string;
  requirements: string[];
  benefits: string[];
  applyUrl: string;
  category: string;
  resumeFile: string;
  coverLetterFile: string;
  recommendationLetter: string;
  resumeMarkdown?: string;
  coverLetterMarkdown?: string;
  recommendationMarkdown?: string;
  archived?: boolean;
  archivedDate?: string;
  lastViewed?: string;
  applied?: boolean;
  appliedDate?: string;
  applicationNotes?: string;
}

interface Interview {
  id: string;
  date: string;
  time: string;
  type: 'phone' | 'video' | 'in-person' | 'other';
  interviewer?: string;
  notes?: string;
}

interface ApplicationStatus {
  [jobId: number]: {
    applied: boolean;
    appliedDate?: string;
    notes?: string;
    interviews?: Interview[];
  };
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>({});
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<number | null>(null);
  const [currentNotes, setCurrentNotes] = useState("");
  const [interviewDialogOpen, setInterviewDialogOpen] = useState(false);
  const [editorDialog, setEditorDialog] = useState<{ open: boolean; markdownUrl: string; title: string }>({ open: false, markdownUrl: '', title: '' });
  const [interviewData, setInterviewData] = useState<Interview>({
    id: '',
    date: '',
    time: '',
    type: 'phone',
    interviewer: '',
    notes: ''
  });
  const [newInterview, setNewInterview] = useState<Partial<Interview>>({
    date: '',
    time: '',
    type: 'video',
    interviewer: '',
    notes: ''
  });
  const [profilePhoto, setProfilePhoto] = useState<string>(
    localStorage.getItem('profilePhoto') || ''
  );
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);

  const handlePreview = (url: string, title: string) => {
    // Open PDF in new tab instead of iframe for better compatibility
    window.open(url, '_blank');
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const photoData = reader.result as string;
        setProfilePhoto(photoData);
        localStorage.setItem('profilePhoto', photoData);
        setPhotoUploadOpen(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto('');
    localStorage.removeItem('profilePhoto');
    setPhotoUploadOpen(false);
  };

  // Load application status from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('applicationStatus');
    if (saved) {
      setApplicationStatus(JSON.parse(saved));
    }
  }, []);

  // Save application status to localStorage
  const saveApplicationStatus = (status: ApplicationStatus) => {
    setApplicationStatus(status);
    localStorage.setItem('applicationStatus', JSON.stringify(status));
  };

  // Mark job as applied
  const markAsApplied = (jobId: number) => {
    const newStatus = {
      ...applicationStatus,
      [jobId]: {
        applied: true,
        appliedDate: new Date().toISOString(),
        notes: applicationStatus[jobId]?.notes || ''
      }
    };
    saveApplicationStatus(newStatus);
  };

  // Open notes dialog
  const openNotesDialog = (jobId: number) => {
    setCurrentJobId(jobId);
    setCurrentNotes(applicationStatus[jobId]?.notes || '');
    setNotesDialogOpen(true);
  };

  // Save notes
  const saveNotes = () => {
    if (currentJobId) {
      const newStatus = {
        ...applicationStatus,
        [currentJobId]: {
          ...applicationStatus[currentJobId],
          applied: applicationStatus[currentJobId]?.applied || false,
          notes: currentNotes
        }
      };
      saveApplicationStatus(newStatus);
      setNotesDialogOpen(false);
    }
  };

  // Download all documents for a job
  const downloadAllDocuments = async (job: Job) => {
    const files = [
      { url: job.resumeFile, name: `Job_${job.id}_Resume.pdf` },
      { url: job.coverLetterFile, name: `Job_${job.id}_Cover_Letter.pdf` },
      { url: job.recommendationLetter, name: `Job_${job.id}_Recommendation.pdf` }
    ];

    for (const file of files) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  // Copy document links to clipboard
  const copyLinksToClipboard = (job: Job) => {
    const baseUrl = window.location.origin;
    const links = `Job #${job.id} - ${job.title}\n\nResume: ${baseUrl}${job.resumeFile}\nCover Letter: ${baseUrl}${job.coverLetterFile}\nRecommendation: ${baseUrl}${job.recommendationLetter}`;
    navigator.clipboard.writeText(links);
  };

  // Generate email with attachments
  const generateEmail = (job: Job) => {
    const subject = encodeURIComponent(`Application for ${job.title} at ${job.company}`);
    const body = encodeURIComponent(
      `Dear Hiring Manager,\n\n` +
      `I am writing to express my interest in the ${job.title} position at ${job.company}.\n\n` +
      `Please find attached my resume, cover letter, and letter of recommendation.\n\n` +
      `Best regards,\nKABUNDI Tshisuaka\n(678) 979-6811\nbertintshisuaka2025@gmail.com`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  // Open interview dialog
  const openInterviewDialog = (jobId: number) => {
    setCurrentJobId(jobId);
    setNewInterview({
      date: '',
      time: '',
      type: 'video',
      interviewer: '',
      notes: ''
    });
    setInterviewDialogOpen(true);
  };

  // Add interview
  const addInterview = () => {
    if (currentJobId && newInterview.date && newInterview.time) {
      const interview: Interview = {
        id: Date.now().toString(),
        date: newInterview.date!,
        time: newInterview.time!,
        type: newInterview.type || 'video',
        interviewer: newInterview.interviewer,
        notes: newInterview.notes
      };

      const currentInterviews = applicationStatus[currentJobId]?.interviews || [];
      const newStatus = {
        ...applicationStatus,
        [currentJobId]: {
          ...applicationStatus[currentJobId],
          applied: applicationStatus[currentJobId]?.applied || false,
          interviews: [...currentInterviews, interview]
        }
      };
      saveApplicationStatus(newStatus);
      setInterviewDialogOpen(false);
    }
  };

  // Delete interview
  const deleteInterview = (jobId: number, interviewId: string) => {
    const currentInterviews = applicationStatus[jobId]?.interviews || [];
    const newStatus = {
      ...applicationStatus,
      [jobId]: {
        ...applicationStatus[jobId],
        interviews: currentInterviews.filter(i => i.id !== interviewId)
      }
    };
    saveApplicationStatus(newStatus);
  };

  useEffect(() => {
    // Fetch jobs data
    fetch("/jobs.json")
      .then((response) => response.json())
      .then((data) => {
        setJobs(data);
        setFilteredJobs(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading jobs:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let filtered = jobs;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (categoryFilter !== "all") {
      filtered = filtered.filter((job) => job.category === categoryFilter);
    }

    // Filter by job type
    if (jobTypeFilter !== "all") {
      filtered = filtered.filter((job) => job.type === jobTypeFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, categoryFilter, jobTypeFilter, jobs]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-black border-b-4 border-yellow-400 sticky top-0 z-50 shadow-lg">
        <div className="container py-6">
          <div className="flex flex-col items-center gap-4">
            {/* Profile Photo */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden bg-gray-800 flex items-center justify-center cursor-pointer"
                   onClick={() => setPhotoUploadOpen(true)}>
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-black text-3xl font-bold">
                    KT
                  </div>
                )}
              </div>
              <button
                onClick={() => setPhotoUploadOpen(true)}
                className="absolute bottom-0 right-0 bg-yellow-400 text-black rounded-full p-2 shadow-lg hover:bg-yellow-500 transition-colors"
                title="Change photo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
            </div>
            
            {/* Company Name */}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-yellow-400 tracking-wide">
                DIVALASER SOFTWARE SOLUTIONS
              </h1>
              <p className="text-yellow-200 text-sm mt-1">Remote Tech Job Portal</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-2">
              <Button asChild variant="outline" size="sm" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                <Link href="/documents">
                  <FileText className="w-4 h-4 mr-2" />
                  All Documents
                </Link>
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <span className="px-3 py-1 bg-yellow-400 text-black rounded-full font-semibold">
                  {jobs.length} Jobs Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Remote Tech Jobs for Bootcamp Graduates
            </h2>
            <p className="text-xl text-gray-900 mb-8">
              Curated opportunities for Software Engineers, Full Stack Developers, and QA Testers
            </p>
            <div className="bg-sky-100 rounded-lg p-2 shadow-xl">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search jobs, companies, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12 text-gray-900 border-0 focus-visible:ring-0"
                  />
                </div>
                <Button className="h-12 px-8 bg-black text-yellow-400 hover:bg-gray-800">Search</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <Card className="sticky top-24 bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                      <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Job Type</label>
                  <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Full-time, Contract to Hire">Contract to Hire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setCategoryFilter("all");
                    setJobTypeFilter("all");
                    setSearchTerm("");
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </aside>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-yellow-400">
                {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
              </h3>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto"></div>
                <p className="mt-4 text-gray-300">Loading jobs...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                  <Button
                    onClick={() => {
                      setCategoryFilter("all");
                      setJobTypeFilter("all");
                      setSearchTerm("");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="bg-blue-50 hover:shadow-lg transition-shadow duration-200 border-blue-200">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                          <CardDescription className="text-base">
                            <div className="flex flex-wrap items-center gap-3 text-gray-600">
                              <span className="font-semibold text-gray-900">{job.company}</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </span>
                            </div>
                          </CardDescription>
                        </div>

                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {job.type}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {job.salary}
                        </Badge>
                        <Badge variant="secondary">{job.category}</Badge>
                      </div>

                      <p className="text-gray-700 leading-relaxed">{job.description}</p>



                      {job.requirements.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {job.requirements.slice(0, 3).map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {job.benefits.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                          <div className="flex flex-wrap gap-2">
                            {job.benefits.map((benefit, index) => (
                              <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                                {benefit}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(job.resumeFile, `Resume - ${job.title}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Resume
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditorDialog({ open: true, markdownUrl: job.resumeMarkdown || '', title: `Resume - ${job.title}` })}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Edit Resume
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <a href={job.resumeFile} download className="text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(job.coverLetterFile, `Cover Letter - ${job.title}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Cover Letter
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditorDialog({ open: true, markdownUrl: job.coverLetterMarkdown || '', title: `Cover Letter - ${job.title}` })}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Edit Cover Letter
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <a href={job.coverLetterFile} download className="text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(job.recommendationLetter, "Letter of Recommendation")}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Recommendation
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditorDialog({ open: true, markdownUrl: job.recommendationMarkdown || '', title: "Letter of Recommendation" })}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Edit Recommendation
                          </Button>
                          <Button asChild variant="ghost" size="sm">
                            <a href={job.recommendationLetter} download className="text-xs">
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                      {/* Application Management Buttons */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadAllDocuments(job)}
                          className="text-xs"
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Download All
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            copyLinksToClipboard(job);
                            alert('Document links copied to clipboard!');
                          }}
                          className="text-xs"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Copy Links
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => generateEmail(job)}
                          className="text-xs"
                        >
                          📧 Email
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openNotesDialog(job.id)}
                          className="text-xs"
                        >
                          📝 Notes
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openInterviewDialog(job.id)}
                          className="text-xs"
                        >
                          📅 Interview
                        </Button>
                      </div>
                      
                      {/* Apply Button with Status */}
                      <div className="flex gap-2 w-full">
                        <Button
                          asChild
                          className={`flex-1 ${applicationStatus[job.id]?.applied ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                          <a href={job.applyUrl} target="_blank" rel="noopener noreferrer" onClick={() => markAsApplied(job.id)}>
                            {applicationStatus[job.id]?.applied ? '✓ Applied' : 'Apply Now'}
                            <ExternalLink className="w-4 h-4 ml-2" />
                          </a>
                        </Button>
                      </div>
                      
                      {/* Application Status */}
                      {applicationStatus[job.id]?.applied && (
                        <div className="text-xs text-gray-600 bg-green-50 p-2 rounded">
                          Applied on: {new Date(applicationStatus[job.id].appliedDate!).toLocaleDateString()}
                          {applicationStatus[job.id].notes && (
                            <div className="mt-1 text-gray-700">Note: {applicationStatus[job.id].notes}</div>
                          )}
                        </div>
                      )}
                      
                      {/* Interview Schedule */}
                      {applicationStatus[job.id]?.interviews && applicationStatus[job.id].interviews!.length > 0 && (
                        <div className="text-xs bg-purple-50 p-3 rounded border border-purple-200">
                          <div className="font-semibold text-purple-900 mb-2">📅 Scheduled Interviews ({applicationStatus[job.id].interviews!.length})</div>
                          <div className="space-y-2">
                            {applicationStatus[job.id].interviews!.map((interview) => (
                              <div key={interview.id} className="bg-white p-2 rounded border border-purple-100">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                      {new Date(interview.date).toLocaleDateString()} at {interview.time}
                                    </div>
                                    <div className="text-gray-600 mt-1">
                                      Type: <span className="capitalize">{interview.type}</span>
                                      {interview.interviewer && ` | Interviewer: ${interview.interviewer}`}
                                    </div>
                                    {interview.notes && (
                                      <div className="text-gray-700 mt-1 italic">{interview.notes}</div>
                                    )}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => deleteInterview(job.id, interview.id)}
                                    className="text-red-600 hover:text-red-800 h-6 w-6 p-0"
                                  >
                                    ×
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTitle}</DialogTitle>
            <DialogDescription>
              Preview document - Click download to save a copy
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {previewUrl && (
              <iframe
                src={previewUrl}
                className="w-full h-[70vh] border rounded-lg"
                title="Document Preview"
              />
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button asChild>
              <a href={previewUrl} download>
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Interview Dialog */}
      <Dialog open={interviewDialogOpen} onOpenChange={setInterviewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule Interview</DialogTitle>
            <DialogDescription>
              Add interview details for this job application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Date</label>
              <Input
                type="date"
                value={newInterview.date}
                onChange={(e) => setNewInterview({...newInterview, date: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Time</label>
              <Input
                type="time"
                value={newInterview.time}
                onChange={(e) => setNewInterview({...newInterview, time: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Interview Type</label>
              <Select
                value={newInterview.type}
                onValueChange={(value: any) => setNewInterview({...newInterview, type: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Interviewer (Optional)</label>
              <Input
                type="text"
                value={newInterview.interviewer}
                onChange={(e) => setNewInterview({...newInterview, interviewer: e.target.value})}
                placeholder="e.g., John Smith, HR Manager"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
              <Textarea
                value={newInterview.notes}
                onChange={(e) => setNewInterview({...newInterview, notes: e.target.value})}
                placeholder="Add any additional notes about the interview..."
                className="min-h-[80px]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setInterviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addInterview} disabled={!newInterview.date || !newInterview.time}>
              Add Interview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notes Dialog */}
      <Dialog open={notesDialogOpen} onOpenChange={setNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Notes</DialogTitle>
            <DialogDescription>
              Add notes about this job application
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              placeholder="Add your notes here... (e.g., interview dates, follow-up actions, contact person)"
              className="min-h-[150px]"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setNotesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveNotes}>
              Save Notes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Editor Dialog */}
      <DocumentEditor
        open={editorDialog.open}
        onOpenChange={(open) => setEditorDialog({ ...editorDialog, open })}
        markdownUrl={editorDialog.markdownUrl}
        title={editorDialog.title}
      />

      {/* Photo Upload Dialog */}
      <Dialog open={photoUploadOpen} onOpenChange={setPhotoUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update Profile Photo</DialogTitle>
            <DialogDescription>
              Upload a new profile photo for your resume and business card
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            {profilePhoto && (
              <div className="flex justify-center">
                <div className="w-32 h-32 rounded-full border-4 border-yellow-400 overflow-hidden">
                  <img src={profilePhoto} alt="Current profile" className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 cursor-pointer transition-colors font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Choose Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              {profilePhoto && (
                <Button
                  variant="outline"
                  onClick={handleRemovePhoto}
                  className="w-full border-red-400 text-red-600 hover:bg-red-50"
                >
                  Remove Photo
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => setPhotoUploadOpen(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">About This Portal</h3>
              <p className="text-gray-400 text-sm">
                Curated remote job opportunities for bootcamp graduates and software engineers. Find your next
                career opportunity in tech.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Your Qualifications</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>✓ Bachelor's in Software Engineering (University of Phoenix)</li>
                <li>✓ Coding Bootcamp Graduate (Georgia Tech)</li>
                <li>✓ QA Software Tester Certificate (JanBask)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Job Categories</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>• Software Engineer</li>
                <li>• Full Stack Developer</li>
                <li>• QA Tester</li>
                <li>• DevOps Engineer</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>© 2025 Remote Tech Jobs Portal. All job listings are from public sources.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


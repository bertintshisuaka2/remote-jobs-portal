import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { APP_TITLE } from "@/const";
import { Briefcase, Download, Eye, FileText, Home, Mail, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Job {
  id: number;
  title: string;
  company: string;
  resumeFile: string;
  coverLetterFile: string;
  recommendationLetter: string;
  category: string;
}

export default function Documents() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  useEffect(() => {
    fetch("/jobs.json")
      .then((response) => response.json())
      .then((data) => setJobs(data))
      .catch((error) => console.error("Error loading jobs:", error));
  }, []);

  const handlePreview = (url: string, title: string) => {
    setPreviewUrl(url);
    setPreviewTitle(title);
    setPreviewOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-sky-50">
      {/* Header */}
      <header className="bg-sky-100 border-b border-sky-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Briefcase className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
                <p className="text-sm text-gray-600">Application Documents Library</p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Document Library</h2>
            <p className="text-gray-600">
              View and download all {jobs.length} tailored resumes, cover letters, and letters of recommendation
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="all">
                <FileText className="w-4 h-4 mr-2" />
                All Documents
              </TabsTrigger>
              <TabsTrigger value="resumes">
                <FileText className="w-4 h-4 mr-2" />
                Resumes ({jobs.length})
              </TabsTrigger>
              <TabsTrigger value="covers">
                <Mail className="w-4 h-4 mr-2" />
                Cover Letters ({jobs.length})
              </TabsTrigger>
              <TabsTrigger value="recommendations">
                <Star className="w-4 h-4 mr-2" />
                Recommendations (1)
              </TabsTrigger>
            </TabsList>

            {/* All Documents Tab */}
            <TabsContent value="all" className="space-y-6">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
                        <CardDescription className="text-base mt-1">{job.company}</CardDescription>
                      </div>
                      <Badge variant="secondary">{job.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Resume */}
                      <div className="border rounded-lg p-4 bg-blue-50">
                        <div className="flex items-center gap-2 mb-3">
                          <FileText className="w-5 h-5 text-blue-600" />
                          <h4 className="font-semibold text-gray-900">Resume</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(job.resumeFile, `Resume - ${job.title}`)}
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview PDF
                          </Button>
                          <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                            <a href={job.resumeFile} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>

                      {/* Cover Letter */}
                      <div className="border rounded-lg p-4 bg-green-50">
                        <div className="flex items-center gap-2 mb-3">
                          <Mail className="w-5 h-5 text-green-600" />
                          <h4 className="font-semibold text-gray-900">Cover Letter</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(job.coverLetterFile, `Cover Letter - ${job.title}`)}
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview PDF
                          </Button>
                          <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
                            <a href={job.coverLetterFile} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>

                      {/* Recommendation */}
                      <div className="border rounded-lg p-4 bg-yellow-50">
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="w-5 h-5 text-yellow-600" />
                          <h4 className="font-semibold text-gray-900">Recommendation</h4>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreview(job.recommendationLetter, "Letter of Recommendation")}
                            className="w-full"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Preview PDF
                          </Button>
                          <Button asChild size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                            <a href={job.recommendationLetter} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Resumes Only Tab */}
            <TabsContent value="resumes">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(job.resumeFile, `Resume - ${job.title}`)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Resume
                      </Button>
                      <Button asChild size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                        <a href={job.resumeFile} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download Resume
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Cover Letters Only Tab */}
            <TabsContent value="covers">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {jobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription>{job.company}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePreview(job.coverLetterFile, `Cover Letter - ${job.title}`)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Cover Letter
                      </Button>
                      <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700">
                        <a href={job.coverLetterFile} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download Cover Letter
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Recommendations Tab */}
            <TabsContent value="recommendations">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl">Letter of Recommendation</CardTitle>
                  <CardDescription>
                    Professional recommendation letter for KABUNDI Tshisuaka
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Star className="w-8 h-8 text-yellow-600" />
                      <div>
                        <h3 className="font-semibold text-lg">Universal Recommendation Letter</h3>
                        <p className="text-sm text-gray-600">Applicable to all positions</p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="outline"
                        onClick={() =>
                          handlePreview(
                            jobs[0]?.recommendationLetter || "/letter_of_recommendation.pdf",
                            "Letter of Recommendation"
                          )
                        }
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview Letter
                      </Button>
                      <Button
                        asChild
                        className="w-full bg-yellow-600 hover:bg-yellow-700"
                      >
                        <a href={jobs[0]?.recommendationLetter || "/letter_of_recommendation.pdf"} download>
                          <Download className="w-4 h-4 mr-2" />
                          Download Letter
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{previewTitle}</DialogTitle>
            <DialogDescription>Preview document - Click download to save a copy</DialogDescription>
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
    </div>
  );
}


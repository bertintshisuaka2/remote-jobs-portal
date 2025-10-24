import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { APP_TITLE } from "@/const";
import { Briefcase, DollarSign, ExternalLink, MapPin, Search } from "lucide-react";
import { useEffect, useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  jobType: string;
  posted: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  applyUrl: string;
  category: string;
}

export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [jobTypeFilter, setJobTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

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
      filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, categoryFilter, jobTypeFilter, jobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{APP_TITLE}</h1>
                <p className="text-sm text-gray-600">Find Your Dream Remote Tech Job</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200">
                {jobs.length} Jobs Available
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Remote Tech Jobs for Bootcamp Graduates
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Curated opportunities for Software Engineers, Full Stack Developers, and QA Testers
            </p>
            <div className="bg-white rounded-lg p-2 shadow-xl">
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
                <Button className="h-12 px-8 bg-blue-600 hover:bg-blue-700">Search</Button>
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
            <Card className="sticky top-24">
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
              <h3 className="text-2xl font-bold text-gray-900">
                {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"} Found
              </h3>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading jobs...</p>
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
                  <Card key={job.id} className="hover:shadow-lg transition-shadow duration-200">
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
                        <Badge
                          variant={job.posted === "New" ? "default" : "secondary"}
                          className={job.posted === "New" ? "bg-green-500 hover:bg-green-600" : ""}
                        >
                          {job.posted}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Briefcase className="w-3 h-3" />
                          {job.jobType}
                        </Badge>
                        <Badge variant="outline" className="flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {job.salary}
                        </Badge>
                        <Badge variant="secondary">{job.category}</Badge>
                      </div>

                      <p className="text-gray-700 leading-relaxed">{job.description}</p>

                      {job.responsibilities.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">Key Responsibilities:</h4>
                          <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                            {job.responsibilities.slice(0, 3).map((resp, index) => (
                              <li key={index}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}

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

                    <CardFooter>
                      <Button asChild className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
                        <a href={job.applyUrl} target="_blank" rel="noopener noreferrer">
                          Apply Now
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

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


import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { SEO } from "@/components/SEO";
import { Loader2, BookOpen, ExternalLink, Search, FileText, Play } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

interface UnifiedItem {
    id: string;
    title: string;
    description: string | null;
    file_url: string | null;
    thumbnail_url: string | null;
    category: string | null;
    created_at: string;
    type: 'resource' | 'report' | 'video';
}

function getEmbedUrl(url: string | null): string | null {
    if (!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
            let videoId = '';
            if (urlObj.hostname.includes('youtu.be')) {
                videoId = urlObj.pathname.slice(1);
            } else {
                videoId = urlObj.searchParams.get('v') || '';
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        }
        if (urlObj.hostname.includes('tiktok.com')) {
            const match = url.match(/\/video\/(\d+)/);
            return match ? `https://www.tiktok.com/embed/v2/${match[1]}` : null;
        }
    } catch (e) { return null; }
    return null;
}

const Library = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterType, setFilterType] = useState<string>("All");

    const { data: items, isLoading } = useQuery({
        queryKey: ["unified-library-public"],
        queryFn: async () => {
            const [libRes, repRes] = await Promise.all([
                supabase.from("digital_library").select("*").eq("is_active", true),
                supabase.from("reports").select("*").eq("status", "published")
            ]);

            const libraryItems = (libRes.data || []).map((i: any) => {
                const embedUrl = getEmbedUrl(i.file_url);
                return {
                    id: i.id,
                    title: i.title,
                    description: i.description,
                    file_url: embedUrl || i.file_url, // Keep embed URL directly if video
                    thumbnail_url: i.thumbnail_url,
                    category: i.category,
                    created_at: i.created_at,
                    type: embedUrl ? 'video' : 'resource'
                } as UnifiedItem;
            });

            const reportItems = (repRes.data || []).map((r: any) => ({
                id: r.id,
                title: r.title,
                description: r.description,
                file_url: r.file_url,
                thumbnail_url: null,
                category: `Report: ${r.report_type || 'Official'}`,
                created_at: r.created_at,
                type: 'report'
            } as UnifiedItem));

            return [...libraryItems, ...reportItems].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        },
    });

    const filteredItems = items?.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
            (item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

        const matchesType = filterType === "All" ||
            (filterType === "Reports" && item.type === "report") ||
            (filterType === "Media" && item.type === "video") ||
            (filterType === "Resources" && item.type === "resource");

        return matchesSearch && matchesType;
    });

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <SEO
                title="Resources & Media | Sustainable Fashion Hub"
                description="Explore our officially published reports, curated educational blogs, and engaging TikTok/YouTube media covering the circular economy."
            />
            <Navbar />
            <main className="flex-1">
                <section className="relative overflow-hidden min-h-[50vh] flex items-center bg-zinc-900">
                    <AuroraBackground className="absolute inset-0 z-0">
                        <div className="container px-4 md:px-6 relative z-10 text-center space-y-6">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 text-xs md:text-sm font-bold uppercase tracking-widest text-[#7CC38A] bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10"
                            >
                                <BookOpen className="h-4 w-4" />
                                <span>Knowledge & Media Hub</span>
                            </motion.div>
                            <h1 className="text-4xl md:text-7xl font-display text-white">
                                The <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#7CC38A] via-[#93c5fd] to-[#7CC38A] animate-aurora-glow">Library</span>
                            </h1>
                            <p className="text-sm md:text-xl text-white/50 font-light max-w-xl mx-auto">
                                Reports, blogs, and media showing our ongoing commitment to circular fashion.
                            </p>
                            <div className="relative max-w-md mx-auto pt-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                                <Input
                                    placeholder="Search resources, reports, or videos..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/10 border-white/20 rounded-full pl-12 h-14 text-white placeholder:text-white/30 focus:ring-[#7CC38A]"
                                />
                            </div>
                        </div>
                    </AuroraBackground>
                </section>

                <section className="py-8 md:py-16">
                    <div className="container px-4 md:px-6">

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                            {["All", "Resources", "Reports", "Media"].map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setFilterType(tab)}
                                    className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${filterType === tab
                                        ? "bg-black text-white border-black"
                                        : "bg-white text-zinc-500 border-zinc-200 hover:border-black"}`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-[#7CC38A]" />
                            </div>
                        ) : filteredItems && filteredItems.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group flex flex-col h-full bg-[#F9F7F2] rounded-[1.5rem] overflow-hidden border border-transparent hover:border-[#7CC38A]/30 transition-all duration-500 hover:shadow-xl hover:-translate-y-1"
                                    >
                                        {item.type === 'video' && item.file_url ? (
                                            <div className="relative w-full aspect-video bg-black">
                                                <iframe
                                                    src={item.file_url}
                                                    className="absolute inset-0 w-full h-full"
                                                    allowFullScreen
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                ></iframe>
                                            </div>
                                        ) : item.type === 'resource' && item.thumbnail_url ? (
                                            <div className="w-full h-48 bg-zinc-100 relative">
                                                <img src={item.thumbnail_url} alt={item.title} className="w-full h-full object-cover" />
                                            </div>
                                        ) : null}

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-start justify-between mb-4">
                                                {item.type === 'report' ? (
                                                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm shrink-0">
                                                        <FileText className="h-5 w-5" />
                                                    </div>
                                                ) : item.type === 'video' ? (
                                                    <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shadow-sm shrink-0">
                                                        <Play className="h-5 w-5 ml-0.5" />
                                                    </div>
                                                ) : (
                                                    <div className="h-12 w-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                                                        <BookOpen className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <Badge variant="outline" className={`rounded-full px-3 py-1 ml-2 ${item.type === 'report' ? 'border-purple-200 text-purple-700' : item.type === 'video' ? 'border-red-200 text-red-700' : 'border-[#7CC38A]/30 text-[#2D5A43]'}`}>
                                                    {item.category || "Resource"}
                                                </Badge>
                                            </div>

                                            <div className="flex-1 space-y-2">
                                                <h3 className="text-lg font-semibold leading-tight group-hover:text-[#2D5A43] transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-muted-foreground font-light leading-relaxed line-clamp-3 text-sm">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div className="pt-6 mt-auto">
                                                {item.file_url && item.type !== 'video' ? (
                                                    <a
                                                        href={item.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-black hover:text-[#2D5A43] transition-colors bg-white px-4 py-2 rounded-full shadow-sm hover:shadow"
                                                    >
                                                        {item.type === 'report' ? 'Read Report' : 'View Resource'}
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                ) : item.type === 'video' ? (
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Embedded Media</span>
                                                ) : (
                                                    <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">In Production</span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 space-y-4 bg-zinc-50 rounded-3xl">
                                <FileText className="h-12 w-12 mx-auto text-zinc-300" />
                                <p className="text-lg font-medium text-zinc-500">No resources found matching your search.</p>
                                <button
                                    onClick={() => { setSearchQuery(""); setFilterType("All"); }}
                                    className="text-[#7CC38A] hover:underline uppercase tracking-widest text-xs font-bold"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default Library;

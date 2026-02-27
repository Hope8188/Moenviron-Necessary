import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { SEO } from "@/components/SEO";
import { Loader2, BookOpen, ExternalLink, Search, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";

interface LibraryItem {
    id: string;
    title: string;
    description: string | null;
    file_url: string | null;
    thumbnail_url: string | null;
    category: string | null;
    is_active: boolean;
    created_at: string;
}

const Library = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const { data: items, isLoading } = useQuery({
        queryKey: ["digital-library-public"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("digital_library")
                .select("*")
                .eq("is_active", true)
                .order("created_at", { ascending: false });
            if (error) throw error;
            return data as LibraryItem[];
        },
    });

    const filteredItems = items?.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        (item.category?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
    );

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <SEO
                title="Digital Library | Sustainable Fashion Resources"
                description="Explore our collection of educational resources, guides, and studies on sustainable fashion and circular economy."
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
                                <span>Educational Hub</span>
                            </motion.div>
                            <h1 className="text-5xl md:text-7xl font-display text-white">
                                Digital <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-[#7CC38A] via-[#93c5fd] to-[#7CC38A] animate-aurora-glow">Library</span>
                            </h1>
                            <p className="text-lg md:text-xl text-white/50 font-light max-w-xl mx-auto">
                                Knowledge is the foundation of sustainability. Explore our curated resources on circular fashion.
                            </p>
                            <div className="relative max-w-md mx-auto pt-4">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30" />
                                <Input
                                    placeholder="Search resources..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-white/10 border-white/20 rounded-full pl-12 h-14 text-white placeholder:text-white/20 focus:ring-[#7CC38A]"
                                />
                            </div>
                        </div>
                    </AuroraBackground>
                </section>

                <section className="py-16 md:py-24">
                    <div className="container px-4 md:px-6">
                        {isLoading ? (
                            <div className="flex justify-center py-20">
                                <Loader2 className="h-10 w-10 animate-spin text-[#7CC38A]" />
                            </div>
                        ) : filteredItems && filteredItems.length > 0 ? (
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                {filteredItems.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="group"
                                    >
                                        <div className="bg-[#F9F7F2] rounded-[2rem] p-8 h-full flex flex-col space-y-6 border border-transparent hover:border-[#7CC38A]/30 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                            <div className="flex items-start justify-between">
                                                <div className="h-14 w-14 rounded-2xl bg-white flex items-center justify-center shadow-sm">
                                                    {item.thumbnail_url ? (
                                                        <img src={item.thumbnail_url} alt="" className="h-10 w-10 object-cover rounded-md" />
                                                    ) : (
                                                        <FileText className="h-6 w-6 text-[#7CC38A]" />
                                                    )}
                                                </div>
                                                <Badge variant="outline" className="rounded-full border-[#7CC38A]/30 text-[#2D5A43] px-3 py-1">
                                                    {item.category || "Resource"}
                                                </Badge>
                                            </div>

                                            <div className="flex-1 space-y-3">
                                                <h3 className="text-xl font-semibold leading-tight group-hover:text-[#2D5A43] transition-colors">
                                                    {item.title}
                                                </h3>
                                                <p className="text-muted-foreground font-light leading-relaxed line-clamp-3 italic text-sm">
                                                    {item.description}
                                                </p>
                                            </div>

                                            <div className="pt-4">
                                                {item.file_url ? (
                                                    <a
                                                        href={item.file_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-black hover:text-[#2D5A43] transition-colors"
                                                    >
                                                        View Resource
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                ) : (
                                                    <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">In Production</span>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 space-y-4">
                                <p className="text-2xl font-display text-muted-foreground">No resources found matching your search.</p>
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="text-[#7CC38A] hover:underline uppercase tracking-widest text-sm font-bold"
                                >
                                    Clear Search
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

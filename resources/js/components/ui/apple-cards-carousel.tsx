"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Link } from "@inertiajs/react";
import { X, ArrowRight, Eye } from "lucide-react";
import { formatRupiah } from "@/lib/storefront";

interface ProductImage {
    id: number;
    path: string;
    is_primary: boolean;
}

interface Category {
    id: number;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: string | number;
    discount_price: string | number | null;
    stock_status: string;
    is_featured: boolean;
    description: string | null;
    category: Category | null;
    images: ProductImage[];
    created_at: string;
}

interface Props {
    products: Product[];
    initialScroll?: number;
}

export const Carousel = ({ products, initialScroll = 0 }: Props) => {
    const carouselRef = useRef<HTMLDivElement>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    useEffect(() => {
        if (carouselRef.current) {
            carouselRef.current.scrollLeft = initialScroll;
        }
    }, [initialScroll]);

    const scroll = (direction: "left" | "right") => {
        if (!carouselRef.current) return;
        const scrollAmount = 400;
        carouselRef.current.scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    return (
        <div className="relative w-full">
            {/* Navigation arrows */}
            <button
                onClick={() => scroll("left")}
                className="absolute top-1/2 -left-4 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all hover:scale-110 active:scale-95"
            >
                <ArrowRight size={18} className="rotate-180 text-gray-700" />
            </button>
            <button
                onClick={() => scroll("right")}
                className="absolute top-1/2 -right-4 z-20 -translate-y-1/2 rounded-full border border-gray-200 bg-white p-3 shadow-lg transition-all hover:scale-110 active:scale-95"
            >
                <ArrowRight size={18} className="text-gray-700" />
            </button>

            <div
                ref={carouselRef}
                className="flex gap-6 overflow-x-auto pb-8 pt-4 scrollbar-hide"
                style={{ scrollSnapType: "x mandatory", scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {products.map((product, index) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        key={product.id}
                        className="group relative shrink-0 cursor-pointer"
                        style={{ scrollSnapAlign: "start" }}
                        onClick={() => setSelectedProduct(product)}
                    >
                        <div className="relative h-[320px] w-[280px] overflow-hidden rounded-[24px] sm:h-[380px] sm:w-[320px] md:h-[420px] md:w-[360px]">
                            {(() => {
                                const img = product.images.find((i) => i.is_primary) ?? product.images[0];
                                const isOutOfStock = product.stock_status === "out_of_stock";

                                return (
                                    <>
                                        {img ? (
                                            <img
                                                src={`/storage/${img.path}`}
                                                alt={product.name}
                                                className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${isOutOfStock ? "grayscale" : ""}`}
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
                                                Foto produk
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                                        {/* Badge */}
                                        <div className="absolute top-4 left-4">
                                            {isOutOfStock ? (
                                                <span className="rounded-full bg-gray-700/90 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                                    Stok Habis
                                                </span>
                                            ) : product.is_featured ? (
                                                <span className="rounded-full bg-[#2547F9] px-3 py-1 text-[11px] font-semibold text-white shadow-md shadow-[#2547F9]/20">
                                                    Best Seller
                                                </span>
                                            ) : (
                                                <span className="rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                                                    {product.category?.name ?? "Produk"}
                                                </span>
                                            )}
                                        </div>

                                        {/* Bottom info */}
                                        <div className="absolute right-0 bottom-0 left-0 p-5">
                                            <h3 className="text-lg leading-snug font-bold tracking-tight text-white">
                                                {product.name}
                                            </h3>
                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-xl font-extrabold text-white">
                                                        {formatRupiah(product.discount_price ?? product.price)}
                                                    </span>
                                                    {product.discount_price && (
                                                        <span className="text-sm text-white/60 line-through">
                                                            {formatRupiah(product.price)}
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1.5 text-[12px] font-medium text-white backdrop-blur-sm transition-colors group-hover:bg-white group-hover:text-[#0f172a]">
                                                    <Eye size={14} />
                                                    Detail
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Modal */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setSelectedProduct(null)}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
                        className="relative z-10 w-full max-w-lg overflow-hidden rounded-[24px] bg-white shadow-2xl dark:bg-[#141414]"
                    >
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 z-20 flex size-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
                        >
                            <X size={16} />
                        </button>

                        {(() => {
                            const img = selectedProduct.images.find((i) => i.is_primary) ?? selectedProduct.images[0];

                            return img ? (
                                <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
                                    <img
                                        src={`/storage/${img.path}`}
                                        alt={selectedProduct.name}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ) : null;
                        })()}

                        <div className="p-6">
                            {selectedProduct.category && (
                                <span className="mb-2 inline-flex rounded-full bg-[#eef1ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#2547F9]">
                                    {selectedProduct.category.name}
                                </span>
                            )}
                            <h3 className="text-xl font-bold tracking-tight text-[#0f172a] dark:text-white">
                                {selectedProduct.name}
                            </h3>
                            <div className="mt-3">
                                {selectedProduct.discount_price ? (
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-extrabold text-[#0f172a] dark:text-white">
                                            {formatRupiah(selectedProduct.discount_price)}
                                        </span>
                                        <span className="text-base text-gray-400 line-through">
                                            {formatRupiah(selectedProduct.price)}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="text-2xl font-extrabold text-[#0f172a] dark:text-white">
                                        {formatRupiah(selectedProduct.price)}
                                    </div>
                                )}
                            </div>
                            {selectedProduct.description ? (
                                <div
                                    className="rich-text mt-4 max-h-[240px] overflow-y-auto pr-1 text-[14px] leading-relaxed text-gray-600 dark:text-gray-400"
                                    dangerouslySetInnerHTML={{ __html: selectedProduct.description }}
                                />
                            ) : (
                                <p className="mt-4 text-[14px] leading-relaxed text-gray-600 dark:text-gray-400">
                                    Belum ada deskripsi.
                                </p>
                            )}
                            <Link
                                href={`/produk/${selectedProduct.slug}`}
                                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#2547F9] py-3 text-[14px] font-semibold text-white shadow-lg shadow-[#2547F9]/20 transition-all hover:bg-[#1e3ce0]"
                            >
                                <Eye size={17} />
                                Lihat Halaman Produk
                            </Link>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

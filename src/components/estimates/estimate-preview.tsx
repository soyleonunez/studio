'use client';
import Image from "next/image";
import type { Company, Estimate } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function calculateTotals(estimate: Estimate) {
    const subtotal = estimate.lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const taxAmount = subtotal * (estimate.taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
}

export function EstimatePreview({ estimate, company }: { estimate: Estimate, company: Company }) {
    const { subtotal, taxAmount, total } = calculateTotals(estimate);

    const handlePrint = () => {
        window.print();
    }

    const handleDownload = () => {
        const input = document.getElementById('printable-area');
        if (input) {
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'in', [3.66, 8.5]); // width, height in inches
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`estimate-${estimate.id}.pdf`);
            });
        }
    }


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Estimate {estimate.id}</h1>
                <div className="flex items-center gap-2">
                    <Button onClick={handlePrint} variant="outline">
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                    </Button>
                     <Button onClick={handleDownload}>
                        <Download className="mr-2 h-4 w-4" />
                        Download PDF
                    </Button>
                </div>
            </div>

            <div id="printable-area" className="bg-card p-8 rounded-lg shadow-lg print-ticket mx-auto">
                <div 
                    className="flex flex-col h-full w-full" 
                    style={{'--accent-color': company.accentColor} as React.CSSProperties}
                >
                    {/* Header */}
                    <div className="flex justify-between items-start pb-4 border-b-2 border-dashed border-gray-400">
                        <div className="flex items-center gap-4">
                            <Image src={company.logoUrl} alt="Company Logo" width={80} height={80} className="rounded-full" data-ai-hint="paw logo"/>
                            <div>
                                <h2 className="text-2xl font-bold text-[var(--accent-color)] tracking-widest">BOARDING PASS</h2>
                                <p className="font-semibold text-lg">{company.name}</p>
                            </div>
                        </div>
                        <div className="text-right">
                           <p className="font-mono text-sm">ESTIMATE #{estimate.id}</p>
                           <p className="text-sm">Date: {new Date(estimate.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-grow flex pt-4">
                        <div className="w-2/3 pr-4 border-r-2 border-dashed border-gray-400">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Owner</p>
                                    <p className="font-semibold">{estimate.owner.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Pet</p>
                                    <p className="font-semibold">{estimate.pet.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Contact</p>
                                    <p>{estimate.owner.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground uppercase">Breed / Age</p>
                                    <p>{estimate.pet.breed}, {estimate.pet.age}</p>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <p className="text-xs text-muted-foreground uppercase mb-2">Services & Products</p>
                                <div className="space-y-2 text-sm">
                                    {estimate.lineItems.map(item => (
                                        <div key={item.id} className="flex justify-between">
                                            <span>{item.quantity}x {item.service}</span>
                                            <span className="font-mono">{formatCurrency(item.quantity * item.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="w-1/3 pl-4 flex flex-col justify-between">
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-mono">{formatCurrency(subtotal)}</span></div>
                                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax ({estimate.taxRate}%)</span><span className="font-mono">{formatCurrency(taxAmount)}</span></div>
                                <div className="flex justify-between font-bold text-lg mt-2 border-t pt-2 border-gray-300"><span className="text-[var(--accent-color)]">Total</span><span className="font-mono text-[var(--accent-color)]">{formatCurrency(total)}</span></div>
                            </div>
                            <div className="text-center space-y-2">
                                <p className="font-bold text-lg">Thank you for your trust!</p>
                                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-16 w-16 mx-auto"><rect width="256" height="256" fill="none"/><path d="M176,128h48a8,8,0,0,1,8,8v48a8,8,0,0,1-8,8H176a8,8,0,0,1-8-8V136A8,8,0,0,1,176,128Z" opacity="0.2"/><path d="M32,72H80a8,8,0,0,1,8,8V96a0,0,0,0,1,0,0H24a0,0,0,0,1,0,0V80A8,8,0,0,1,32,72Z" opacity="0.2"/><path d="M88,104v24a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V104Z" opacity="0.2"/><path d="M32,184H80a8,8,0,0,1,8,8v24a0,0,0,0,1,0,0H24a0,0,0,0,1,0,0V192A8,8,0,0,1,32,184Z" opacity="0.2"/><path d="M152,72h24a8,8,0,0,1,8,8v48a8,8,0,0,1-8,8H152a8,8,0,0,1-8-8V80A8,8,0,0,1,152,72Z" opacity="0.2"/><path d="M104,72h24a8,8,0,0,1,8,8v24a0,0,0,0,1,0,0H96a0,0,0,0,1,0,0V80A8,8,0,0,1,104,72Z" opacity="0.2"/><path d="M104,128h24a8,8,0,0,1,8,8v24a0,0,0,0,1,0,0H96a0,0,0,0,1,0,0V136A8,8,0,0,1,104,128Z" opacity="0.2"/><path d="M88,160v24a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V160Z" opacity="0.2"/><path d="M152,152h24a8,8,0,0,1,8,8v48a8,8,0,0,1-8,8H152a8,8,0,0,1-8-8V160A8,8,0,0,1,152,152Z" opacity="0.2"/><path d="M224,72h-24a8,8,0,0,0-8,8v24h40V80A8,8,0,0,0,224,72Z" opacity="0.2"/><path d="M104,184h24a8,8,0,0,1,8,8v24h-40V192A8,8,0,0,1,104,184Z" opacity="0.2"/><path d="M200.4,56.9,165,21.5a8,8,0,0,0-11.3,0L118.4,56.9a8,8,0,0,0,0,11.3L153.7,103a8,8,0,0,0,11.3,0L200.4,68.2A8,8,0,0,0,200.4,56.9ZM159.4,85.9l-24.1-24.1L159.4,37.7l24.1,24.1Z" fill="currentColor"/><path d="M88,72v24H24V72H88m0-8H24a8,8,0,0,0-8,8V96h72V80a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M88,104v32H24V104H88m0-8H24a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8H88a8,8,0,0,0,8-8V104a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M88,152v24H24V152H88m0-8H24a8,8,0,0,0-8,8v24a8,8,0,0,0,8,8H88a8,8,0,0,0,8-8V152a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M88,184v32H24V184H88m0-8H24a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8H88a8,8,0,0,0,8-8V184a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M136,72v32H96V72h40m0-8H96a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8h40a8,8,0,0,0,8-8V80a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M136,128v32H96V128h40m0-8H96a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8h40a8,8,0,0,0,8-8V136a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M136,184v32H96V184h40m0-8H96a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8h40a8,8,0,0,0,8-8V192a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M184,72v64H144V72h40m0-8H144a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h40a8,8,0,0,0,8-8V80a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M232,72v32H192V72h40m0-8H192a8,8,0,0,0-8,8v32a8,8,0,0,0,8,8h40a8,8,0,0,0,8-8V80a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M184,152v64H144V152h40m0-8H144a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h40a8,8,0,0,0,8-8V160a8,8,0,0,0-8-8Z" fill="currentColor"/><path d="M232,128v64H168V128h64m0-8H168a8,8,0,0,0-8,8v64a8,8,0,0,0,8,8h64a8,8,0,0,0,8-8V136a8,8,0,0,0-8-8Z" fill="currentColor"/></svg>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-xs text-muted-foreground pt-2 mt-auto">
                        <p>{company.disclaimer}</p>
                        <p className="text-center mt-2">{company.name} | {company.address} | {company.contactInfo}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

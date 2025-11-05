'use client';
import Image from "next/image";
import type { Company } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, Printer } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import type { TempEstimateFormData } from "./temporary-estimate-card";

function calculateTotals(estimateData: TempEstimateFormData) {
    const subtotal = estimateData.lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const taxAmount = subtotal * (estimateData.taxRate / 100);
    const total = subtotal + taxAmount;
    return { subtotal, taxAmount, total };
}

export function TemporaryEstimatePreview({ estimateData, company }: { estimateData: TempEstimateFormData, company: Company }) {
    const { subtotal, taxAmount, total } = calculateTotals(estimateData);
    const today = new Date();

    const handlePrint = () => {
        window.print();
    }

    const handleDownload = () => {
        const input = document.getElementById('printable-area-temp');
        if (input) {
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'pt', 'a4'); // portrait, points, a4
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`presupuesto-${today.toISOString().split('T')[0]}.pdf`);
            });
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-end items-center mb-6 gap-2">
                <Button onClick={handlePrint} variant="outline">
                    <Printer className="mr-2 h-4 w-4" />
                    Imprimir
                </Button>
                 <Button onClick={handleDownload}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                </Button>
            </div>

            <div id="printable-area-temp" className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 text-black">
                <div className="flex justify-between items-start pb-6 border-b">
                    <div className="flex items-center gap-4">
                        {company.logoUrl && (
                            <Image src={company.logoUrl} alt="Logo de la Compañía" width={80} height={80} className="rounded-lg object-contain" data-ai-hint="logo veterinaria"/>
                        )}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">{company.name}</h2>
                            <p className="text-sm text-gray-500">{company.address}</p>
                            <p className="text-sm text-gray-500">{company.contactInfo}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <h3 className="text-2xl font-semibold uppercase text-gray-800">Presupuesto</h3>
                        <p className="text-sm text-gray-500">Fecha: {today.toLocaleDateString('es-ES')}</p>
                    </div>
                </div>

                <div className="mt-8">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50">
                                <TableHead className="w-2/3">Servicio / Producto</TableHead>
                                <TableHead className="text-center">Cantidad</TableHead>
                                <TableHead className="text-right">Precio Unitario</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {estimateData.lineItems.map(item => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium whitespace-normal">
                                        {item.service}
                                    </TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.price)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.quantity * item.price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                
                <div className="flex justify-end mt-8">
                    <div className="w-full max-w-xs space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">{formatCurrency(subtotal)}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-gray-600">Impuesto ({estimateData.taxRate}%)</span>
                            <span className="font-medium">{formatCurrency(taxAmount)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-gray-800">Total</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t text-center">
                    <p className="text-sm font-bold text-gray-800 mb-2">¡Gracias por su confianza!</p>
                    <p className="text-xs text-gray-500">{company.disclaimer}</p>
                </div>
            </div>
        </div>
    );
}

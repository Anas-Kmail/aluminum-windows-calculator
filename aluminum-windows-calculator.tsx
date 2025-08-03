"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Calculator } from "lucide-react"
import jsPDF from "jspdf"

interface WindowData {
  length: number
  width: number
}

interface CalculatedWindow {
  number: number
  frameLength: number
  frameWidth: number
  sashLength: number
  sashWidth: number
}

export default function Component() {
  const [numberOfWindows, setNumberOfWindows] = useState<number>(1)
  const [windowsData, setWindowsData] = useState<WindowData[]>([{ length: 0, width: 0 }])
  const [calculatedResults, setCalculatedResults] = useState<CalculatedWindow[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleNumberOfWindowsChange = (value: number) => {
    const newValue = Math.max(1, value)
    setNumberOfWindows(newValue)

    const newWindowsData = Array.from({ length: newValue }, (_, index) => windowsData[index] || { length: 0, width: 0 })
    setWindowsData(newWindowsData)
    setShowResults(false)
  }

  const handleWindowDataChange = (index: number, field: "length" | "width", value: number) => {
    const newWindowsData = [...windowsData]
    newWindowsData[index] = { ...newWindowsData[index], [field]: value }
    setWindowsData(newWindowsData)
  }

  const calculateResults = () => {
    const results: CalculatedWindow[] = windowsData.map((window, index) => ({
      number: index + 1,
      frameLength: window.length,
      frameWidth: window.width - 2.6,
      sashLength: window.length - 6,
      sashWidth: (window.width - 2.6) / 2,
    }))

    setCalculatedResults(results)
    setShowResults(true)
  }

  const downloadPDF = () => {
    const doc = new jsPDF()

    // Add Arabic font support (using default for now)
    doc.setFont("helvetica")
    doc.setFontSize(16)

    // Title
    doc.text("حاسبة نوافذ الألمنيوم", 105, 20, { align: "center" })

    // Table headers
    doc.setFontSize(12)
    let yPosition = 40

    doc.text("رقم النافذة", 20, yPosition)
    doc.text("طول الإطار (سم)", 60, yPosition)
    doc.text("عرض الإطار (سم)", 100, yPosition)
    doc.text("طول الضلفة (سم)", 140, yPosition)
    doc.text("عرض الضلفة (سم)", 180, yPosition)

    // Draw line under headers
    doc.line(15, yPosition + 5, 195, yPosition + 5)

    // Table data
    yPosition += 15
    calculatedResults.forEach((result) => {
      doc.text(result.number.toString(), 20, yPosition)
      doc.text(result.frameLength.toFixed(1), 60, yPosition)
      doc.text(result.frameWidth.toFixed(1), 100, yPosition)
      doc.text(result.sashLength.toFixed(1), 140, yPosition)
      doc.text(result.sashWidth.toFixed(1), 180, yPosition)
      yPosition += 10
    })

    doc.save("aluminum-windows-calculations.pdf")
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-gray-800">حاسبة نوافذ الألمنيوم</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Number of windows input */}
            <div className="space-y-2">
              <Label htmlFor="numberOfWindows" className="text-lg font-medium">
                عدد النوافذ
              </Label>
              <Input
                id="numberOfWindows"
                type="number"
                min="1"
                value={numberOfWindows}
                onChange={(e) => handleNumberOfWindowsChange(Number.parseInt(e.target.value) || 1)}
                className="w-full text-lg"
              />
            </div>

            {/* Dynamic window inputs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-700">أبعاد النوافذ (بالسنتيمتر)</h3>
              <div className="grid gap-4">
                {windowsData.map((window, index) => (
                  <Card key={index} className="p-4 bg-white border-2">
                    <h4 className="font-medium mb-3 text-gray-600">النافذة رقم {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  <div className="space-y-2">
                        <Label htmlFor={`width-${index}`}>العرض (سم)</Label>
                        <Input
                          id={`width-${index}`}
                          type="number"
                          min="0"
                          step="0.1"
                          value={window.width || ""}
                          onChange={(e) =>
                            handleWindowDataChange(index, "width", Number.parseFloat(e.target.value) || 0)
                          }
                          placeholder="أدخل العرض"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`length-${index}`}>الطول (سم)</Label>
                        <Input
                          id={`length-${index}`}
                          type="number"
                          min="0"
                          step="0.1"
                          value={window.length || ""}
                          onChange={(e) =>
                            handleWindowDataChange(index, "length", Number.parseFloat(e.target.value) || 0)
                          }
                          placeholder="أدخل الطول"
                        />
                      </div>
                    
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Calculate button */}
            <Button
              onClick={calculateResults}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-3"
              size="lg"
            >
              <Calculator className="ml-2 h-5 w-5" />
              احسب النتائج
            </Button>
          </CardContent>
        </Card>

        {/* Results table */}
        {showResults && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold text-gray-800">نتائج الحسابات</CardTitle>
              <Button onClick={downloadPDF} className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="ml-2 h-4 w-4" />
                تحميل PDF
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right font-bold">رقم النافذة</TableHead>
                      <TableHead className="text-right font-bold">طول الحلق (سم)</TableHead>
                      <TableHead className="text-right font-bold">عرض الحلق (سم)</TableHead>
                      <TableHead className="text-right font-bold">طول الدفة (سم)</TableHead>
                      <TableHead className="text-right font-bold">عرض الدفة (سم)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {calculatedResults.map((result) => (
                      <TableRow key={result.number}>
                        <TableCell className="font-medium">{result.number}</TableCell>
                        <TableCell>{result.frameLength.toFixed(1)}</TableCell>
                        <TableCell>{result.frameWidth.toFixed(1)}</TableCell>
                        <TableCell>{result.sashLength.toFixed(1)}</TableCell>
                        <TableCell>{result.sashWidth.toFixed(1)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

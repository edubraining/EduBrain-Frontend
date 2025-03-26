import React from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import Certificate from './Certificate'

interface CertificateModalProps {
  onClose: () => void
  userName: string
  courseName: string
  completionDate: string
  logoUrl: string
}

const CertificateModal: React.FC<CertificateModalProps> = ({
  onClose,
  userName,
  courseName,
  completionDate,
  logoUrl,
}) => {
  const handleDownload = (): void => {

    
    const certificateElement = document.getElementById('certificate')
    if (certificateElement) {
      html2canvas(certificateElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png')
        // eslint-disable-next-line new-cap
        const pdf = new jsPDF('l', 'mm', 'a4')
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = pdf.internal.pageSize.getHeight()
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
        pdf.save('certificate.pdf')
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-auto">
      <div className="bg-white p-8 rounded-xl max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-4">
          Course Completion Certificate
        </h2>
        <div id="certificate">
          <Certificate
            userName={userName}
            courseName={courseName}
            completionDate={completionDate}
            logoUrl={
              'http://localhost:3000/static/media/logo.bc4f089b129b04580c65.png'
            }
          />
        </div>
       <div className="flex">
       <div className="flex justify-end space-x-4 mt-4">
          <button
            className="px-4 py-2 bg-gray-200 rounded-md"
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="px-4 py-2 bg-blue-500  rounded-md"
            onClick={handleDownload}
          >
            Download Certificate
          </button>
        </div>
       </div>
      </div>
    </div>
  )
}

export default CertificateModal

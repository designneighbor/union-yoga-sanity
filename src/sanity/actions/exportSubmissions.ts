import { DocumentActionComponent } from 'sanity'
import { createClient } from 'next-sanity'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false
})

export const exportSubmissionsAction: DocumentActionComponent = (props) => {
  const { onComplete } = props

  return {
    label: 'Export as CSV',
    icon: () => '📊',
    onHandle: async () => {
      try {
        // Get the current document
        const doc = await client.getDocument(props.id)
        
        if (!doc || doc._type !== 'formSubmission') {
          return
        }

        // Create CSV content
        const csvHeaders = ['Field Label', 'Value', 'Submitted At', 'Status', 'IP Address']
        const csvRows = [
          csvHeaders.join(','),
          ...doc.data.map((field: { fieldLabel?: string; value?: string }) => [
            `"${field.fieldLabel || ''}"`,
            `"${field.value || ''}"`,
            `"${doc.submittedAt || ''}"`,
            `"${doc.status || ''}"`,
            `"${doc.ipAddress || ''}"`
          ].join(','))
        ]

        const csvContent = csvRows.join('\n')
        
        // Create and download file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        
        link.setAttribute('href', url)
        link.setAttribute('download', `form-submission-${doc._id}.csv`)
        link.style.visibility = 'hidden'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        onComplete()
      } catch (error) {
        console.error('Export failed:', error)
        // You could show a toast notification here
      }
    }
  }
}

// Bulk export action for multiple submissions
export const bulkExportSubmissionsAction: DocumentActionComponent = (props) => {
  const { onComplete } = props

  return {
    label: 'Export Selected as CSV',
    icon: () => '📊',
    onHandle: async () => {
      try {
        // This would need to be implemented with the list view context
        // For now, this is a placeholder for bulk export functionality
        console.log('Bulk export not yet implemented')
        onComplete()
      } catch (error) {
        console.error('Bulk export failed:', error)
      }
    }
  }
}

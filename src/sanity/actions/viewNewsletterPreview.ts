import { DocumentActionComponent } from "sanity";
import {LaunchIcon} from '@sanity/icons'


export const viewNewsletterPreviewAction: DocumentActionComponent = (props) => {
  const { id } = props;

  return {
    label: "View in Browser",
    icon: LaunchIcon,
    onHandle: () => {
      // Get the site URL from environment or current origin
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      
      // Construct the preview URL
      const previewUrl = `${siteUrl}/api/newsletters/preview?id=${id}`;
      
      // Open in new tab
      window.open(previewUrl, "_blank");
    },
  };
};



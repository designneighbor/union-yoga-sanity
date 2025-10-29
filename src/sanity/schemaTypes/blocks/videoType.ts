import { defineField, defineType } from "sanity";
import { PlayIcon } from "@sanity/icons";

export const videoType = defineType({
  name: "video",
  type: "object",
  title: "Video",
  icon: PlayIcon,
  fields: [
    defineField({
      name: "url",
      type: "url",
      title: "YouTube URL",
      description: "Paste a YouTube URL (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ)",
      validation: (Rule) => 
        Rule.required()
          .custom((url) => {
            if (!url) return true;
            
            const youtubePatterns = [
              /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
              /^https?:\/\/youtu\.be\/[\w-]+/,
              /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/
            ];
            
            const isValidYouTube = youtubePatterns.some(pattern => pattern.test(url));
            
            if (!isValidYouTube) {
              return "Please enter a valid YouTube URL (youtube.com/watch?v=..., youtu.be/..., or youtube.com/embed/...)";
            }
            
            return true;
          }),
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Video Title",
      description: "Optional title that will be displayed as a heading above the video",
    }),
    defineField({
      name: "alt",
      type: "string",
      title: "Alt Text",
      description: "Describe the video thumbnail for accessibility (recommended)",
      validation: (Rule) => Rule.max(200),
    }),
  ],
  preview: {
    select: {
      title: "title",
      url: "url",
      alt: "alt",
    },
    prepare({ title, url, alt }) {
      // Extract video ID for thumbnail
      const extractVideoId = (url: string): string | null => {
        const patterns = [
          /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\?\/]+)/,
        ];
        for (const pattern of patterns) {
          const match = url?.match(pattern);
          if (match) return match[1];
        }
        return null;
      };

      const videoId = url ? extractVideoId(url) : null;
      const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;

      return {
        title: title || "Video Block",
        subtitle: url ? `YouTube: ${videoId || 'Invalid URL'}` : "No URL provided",
        media: thumbnailUrl || PlayIcon,
      };
    },
  },
});

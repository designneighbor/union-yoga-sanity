import { defineQuery } from "next-sanity";

export const POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0...12]{
  _id,
  title,
  slug,
  body,
  mainImage,
  publishedAt,
  "categories": coalesce(
    categories[]->{
      _id,
      slug,
      title
    },
    []
  ),
  author->{
    name,
    image
  }
}`);

export const POSTS_SLUGS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current)]{ 
  "slug": slug.current
}`);

export const POST_QUERY =
  defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  body,
  mainImage,
  publishedAt,
  "categories": coalesce(
    categories[]->{
      _id,
      slug,
      title
    },
    []
  ),
  author->{
    name,
    image
  }
}`);

export const PAGE_QUERY =
  defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  ...,
  content[]{
    ...,
    _type == "faqs" => {
      ...,
      faqs[]->{
        _id,
        _type,
        title,
        body
      }
    },
    _type == "testimonials" => {
      ...,
      testimonials[]->{
        _id,
        _type,
        quote,
        name,
        company,
        image
      }
    },
    _type == "formBlock" => {
  ...,
  form->{
    _id,
    name,
    title,
    text,
    fields[]{
      name,
      label,
      fieldType,
      required,
      options[]{
        label,
        value
      }
    },
    submitButtonText,
    recipientEmail
  }
}
  }
}`);

export const SITE_SETTINGS_QUERY = defineQuery(`*[_type == "siteSettings"][0] {
  homePage->{
    title,
    "slug": slug.current
  },
  navigation[] {
    title,
    "pageSlug": page->slug.current,
    "pageTitle": page->title,
    externalUrl,
    openInNewTab
  }
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
  homePage->{
    ...,
    content[]{
      ...,
      _type == "faqs" => {
        ...,
        faqs[]->{
          _id,
          _type,
          title,
          body
        }
      },
      _type == "testimonials" => {
        ...,
        testimonials[]->{
          _id,
          _type,
          quote,
          name,
          company,
          image
        }
      },
      _type == "formBlock" => {
  ...,
  form->{
    _id,
    name,
    title,
    text,
    fields[]{
      name,
      label,
      fieldType,
      required,
      options[]{
        label,
        value
      }
    },
    submitButtonText,
    recipientEmail
  }
}
    }      
  }
}`);

export const FORM_QUERY = defineQuery(`*[_type == "form" && _id == $formId][0]{
  _id,
  name,
  title,
  text,
  fields[]{
    name,
    label,
    fieldType,
    required,
    width,
    options[]{
      label,
      value
    }
  },
  submitButtonText,
  recipientEmail
}`);

export const NEWSLETTER_QUERY = defineQuery(`*[_type == "newsletter" && _id == $id][0]{
  _id,
  title,
  content[]{
    ...,
    _type == "emailTestimonials" => {
      ...,
      testimonials[]->{
        _id,
        quote,
        name,
        company,
        image
      }
    },
    _type == "emailBlogPosts" => {
      ...,
      posts[]->{
        _id,
        title,
        slug,
        mainImage,
        publishedAt
      }
    }
  },
  status,
  scheduledSendTime,
  platform,
  sentCount,
  sentAt,
  deliveryStats
}`);

export const SUBSCRIBERS_QUERY = defineQuery(`*[_type == "subscriber"]|order(subscribedAt desc){
  _id,
  email,
  subscribed,
  subscriptionStatus,
  subscribedAt,
  confirmedAt,
  lastEmailSent->{
    _id,
    title,
    sentAt
  },
  unsubscribedAt,
  unsubscribeReason,
  tags,
  platformId
}`);

export const ACTIVE_SUBSCRIBERS_QUERY = defineQuery(`*[_type == "subscriber" && subscriptionStatus == "subscribed"]{
  _id,
  email
}`);

export const RECENT_TESTIMONIALS_QUERY = defineQuery(`*[_type == "testimonial"]|order(_createdAt desc)[0...$count]{
  _id,
  quote,
  name,
  company,
  image
}`);

export const RECENT_POSTS_QUERY = defineQuery(`*[_type == "post" && defined(slug.current)]|order(publishedAt desc)[0...$count]{
  _id,
  title,
  slug,
  mainImage,
  publishedAt
}`);

import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      // Newsletter Section
      S.listItem()
        .id("newsletterSection")
        .title("Newsletter")
        .child(
          S.list()
            .title("Newsletter")
            .items([
              S.documentTypeListItem("newsletter").title("Newsletters"),
              S.listItem()
                .id("subscribers")
                .title("Subscribers")
                .child(
                  S.documentTypeList("subscriber")
                    .title("Subscribers")
                    .filter('_type == "subscriber"')
                    .defaultOrdering([{ field: "subscribeDate", direction: "desc" }])
                    .child((id) =>
                      S.document()
                        .schemaType("subscriber")
                        .documentId(id)
                    )
                ),
            ])
        ),
      S.divider(),
      // Blog Section
      S.documentTypeListItem("post").title("Posts"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("author").title("Authors"),
      S.divider(),
      // Forms Section
      S.documentTypeListItem("form").title("Forms"),
      S.listItem()
        .id("formSubmissions")
        .title("Form Submissions")
        .child(
          S.documentTypeList("formSubmission")
            .title("Form Submissions")
            .filter('_type == "formSubmission"')
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }])
        ),
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("faq").title("FAQs"),
      S.listItem()
        .id("siteSettings")
        .schemaType("siteSettings")
        .title("Site Settings")
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          !["post", "category", "author", "form", "formSubmission", "page", "faq", "siteSettings", "newsletter", "subscriber"].includes(item.getId()!)
      ),
    ]);

import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.documentTypeListItem("post").title("Posts"),
      S.documentTypeListItem("category").title("Categories"),
      S.documentTypeListItem("author").title("Authors"),
      S.divider(),
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
      S.divider(),
      S.listItem()
        .id("newsletter")
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
                    .defaultOrdering([{ field: "subscribedAt", direction: "desc" }])
                    .canHandleIntent((intentName, params) => {
                      return intentName === "edit" && params.type === "subscriber";
                    })
                ),
            ])
        ),
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
          !["post", "category", "author", "form", "formSubmission", "page", "faq", "newsletter", "subscriber", "siteSettings"].includes(item.getId()!)
      ),
    ]);

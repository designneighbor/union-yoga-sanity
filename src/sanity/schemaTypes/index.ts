import { type SchemaTypeDefinition } from 'sanity'
import { pageType } from "./pageType";
import { pageBuilderType } from "./pageBuilderType";
import { siteSettingsType } from "./siteSettingsType";
import { faqType } from "./faqType";
import { faqsType } from "./blocks/faqsType";
import { featuresType } from "./blocks/featuresType";
import { heroType } from "./blocks/heroType";
import { pageTitleType } from "./blocks/pageTitleType";
import { splitImageType } from "./blocks/splitImageType";
import { callToActionType } from "./blocks/callToActionType";
import { proseType } from "./blocks/proseType";
import { testimonialsType } from "./blocks/testimonialsType";
import { testimonialType } from "./testimonalType";
import { formType } from "./formType";
import { formFieldType } from "./formFieldType";
import { formBlockType } from "./blocks/formBlockType";
import { formSubmissionType } from "./formSubmissionType";

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    blockContentType,
    categoryType,
    postType,
    authorType,
    pageType,
    pageBuilderType,
    faqType,
    faqsType,
    proseType,
    siteSettingsType,
    featuresType,
    pageTitleType,
    heroType,
    splitImageType,
    callToActionType,
    testimonialType,
    testimonialsType,
    formType,
    formFieldType,
    formBlockType,
    formSubmissionType,
  ],
}

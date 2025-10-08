import { type SchemaTypeDefinition } from 'sanity'
import { pageType } from "./pageType";
import { pageBuilderType } from "./pageBuilderType";
import { siteSettingsType } from "./siteSettingsType";
import { faqType } from "./faqType";
import { faqsType } from "./blocks/faqsType";
import { featuresType } from "./blocks/featuresType";
import { heroType } from "./blocks/heroType";
import { splitImageType } from "./blocks/splitImageType";

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
    siteSettingsType,
    featuresType,
    heroType,
    splitImageType,
  ],
}

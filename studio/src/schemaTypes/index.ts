import {person} from './documents/person'
import {page} from './documents/page'
import {post} from './documents/post'
import {postTag} from './documents/postTag'
import {portfolioProject} from './documents/portfolioProject'
import {portfolioTag} from './documents/portfolioTag'
import {portfolioOverview} from './singletons/portfolioOverview'
import {callToAction} from './objects/callToAction'
import {infoSection} from './objects/infoSection'
import {settings} from './singletons/settings'
import {homepage} from './singletons/homepage'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import button from './objects/button'
import {blockContentTextOnly} from './objects/blockContentTextOnly'
import {navigation} from './singletons/navigation'
import heroSplitImageRight from './objects/heroSplitImageRight'
import deviceCropped from './objects/deviceCropped'
import contentBlockGrid from './objects/contentBlockGrid'
import carouselCards from './objects/carouselCards'
import imageCollage from './objects/imageCollage'
import imageCollageContent from './objects/imageCollageContent'
import abstractCardsCarousel from './objects/abstractCardsCarousel'
import {sectionHeading} from './objects/sectionHeading'
import contentDetails from './objects/contentDetails'
import featuredPosts from './objects/featuredPosts'
import pageHeader from './objects/pageHeader'
import statsBlock from './objects/statsBlock'
import minimalHeader from './objects/minimalHeader'
import imageHero from './objects/imageHero'
import bentoGrid from './objects/bentoGrid'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/studio/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  homepage,
  navigation,
  portfolioOverview,
  // Documents
  page,
  post,
  postTag,
  portfolioProject,
  portfolioTag,
  person,
  // Objects
  button,
  blockContent,
  blockContentTextOnly,
  infoSection,
  callToAction,
  link,
  heroSplitImageRight,
  deviceCropped,
  contentBlockGrid,
  carouselCards,
  abstractCardsCarousel,
  imageCollage,
  imageCollageContent,
  sectionHeading,
  contentDetails,
  featuredPosts,
  pageHeader,
  statsBlock,
  minimalHeader,
  imageHero,
  bentoGrid,
]

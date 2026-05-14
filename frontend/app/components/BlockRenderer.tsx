import React from 'react'

import Cta from '@/app/components/Cta'
import Info from '@/app/components/InfoSection'
import {dataAttr} from '@/sanity/lib/utils'
import {PageBuilderSection} from '@/sanity/lib/types'
import HeroSplitImageRightBlock from '@/app/components/HeroSplitImageRightBlock'
import DeviceCroppedBlock from '@/app/components/DeviceCroppedBlock'
import ContentBlockGridBlock from '@/app/components/ContentBlockGridBlock'
import CarouselCardsBlock from '@/app/components/CarouselCardsBlock'
import AbstractCardsCarouselBlock from '@/app/components/AbstractCardsCarouselBlock'
import ImageCollageBlock from '@/app/components/ImageCollageBlock'
import ImageCollageContentBlock from '@/app/components/ImageCollageContentBlock'
import SectionHeadingBlock from '@/app/components/SectionHeadingBlock'
import ContentDetailsBlock from '@/app/components/ContentDetailsBlock'
import FeaturedPostsBlock from '@/app/components/FeaturedPostsBlock'
import PageHeaderBlock from '@/app/components/PageHeaderBlock'
import StatsBlockBlock from '@/app/components/StatsBlockBlock'
import MinimalHeaderBlock from '@/app/components/MinimalHeaderBlock'

type BlockProps = {
  index: number
  block: PageBuilderSection
  pageId: string
  pageType: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BlocksType = Record<string, React.FC<any>>

const Blocks: BlocksType = {
  callToAction: Cta,
  infoSection: Info,
  heroSplitImageRight: HeroSplitImageRightBlock,
  deviceCropped: DeviceCroppedBlock,
  contentBlockGrid: ContentBlockGridBlock,
  carouselCards: CarouselCardsBlock,
  abstractCardsCarousel: AbstractCardsCarouselBlock,
  imageCollage: ImageCollageBlock,
  imageCollageContent: ImageCollageContentBlock,
  sectionHeading: SectionHeadingBlock,
  contentDetails: ContentDetailsBlock,
  featuredPosts: FeaturedPostsBlock,
  pageHeader: PageHeaderBlock,
  statsBlock: StatsBlockBlock,
  minimalHeader: MinimalHeaderBlock,
}

/**
 * Used by the <PageBuilder>, this component renders a the component that matches the block type.
 */
export default function BlockRenderer({block, index, pageId, pageType}: BlockProps) {
  // Block does exist
  if (typeof Blocks[block._type] !== 'undefined') {
    return (
      <div
        key={block._key}
        data-sanity={dataAttr({
          id: pageId,
          type: pageType,
          path: `pageBuilder[_key=="${block._key}"]`,
        }).toString()}
      >
        {React.createElement(Blocks[block._type], {
          key: block._key,
          block: block,
          index: index,
          pageId: pageId,
          pageType: pageType,
        })}
      </div>
    )
  }
  // Block doesn't exist yet
  return React.createElement(
    () => (
      <div className="w-full bg-gray-100 text-center text-gray-500 p-20 rounded">
        A &ldquo;{block._type}&rdquo; block hasn&apos;t been created
      </div>
    ),
    {key: block._key},
  )
}

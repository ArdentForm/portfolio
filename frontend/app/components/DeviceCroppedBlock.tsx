import DeviceCropped from '@/app/components/DeviceCropped'

type DeviceCroppedBlockProps = {
  block: any
}

export default function DeviceCroppedBlock({ block }: DeviceCroppedBlockProps) {
  return <DeviceCropped block={block} />
}

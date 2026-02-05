'use client'

import { IconAlertCircle, IconArrowRight, IconCheck } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { CAPTURED_IMAGES_KEY } from '@/lib/constants'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '../ui/avatar'

export function CapturedImagePreview() {
  const [image, setImage] = useState<string | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem(CAPTURED_IMAGES_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as { image?: string }[]
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (parsed[0]?.image) setImage(parsed[0].image)
    } catch {
      // ignore malformed storage
    }
  }, [])

  if (!image) return null

  return (
    <div className="flex justify-center items-center gap-4 py-4">
      <div className="relative">
        <Avatar size="lg" className="data-[size=lg]:size-16">
          <AvatarImage src={image} alt="Your captured face" />
          <AvatarFallback>CF</AvatarFallback>
        </Avatar>
      </div>

      <IconArrowRight className="size-5 text-primary" />

      <div className="relative">
        <AvatarGroup className="-space-x-5">
          <Avatar size="lg" className="data-[size=lg]:size-12">
            <AvatarImage
              src="https://plugins-media.makeupar.com/webconsultation/images/skincare-widget/img_webcm_skincare_service_survey_demo.jpg"
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
            <AvatarBadge className="bg-green-500">
              <IconCheck className="size-4 text-primary-foreground" />
            </AvatarBadge>
          </Avatar>
          <Avatar size="lg" className="data-[size=lg]:size-12">
            <AvatarImage src="https://github.com/maxleiter.png" alt="@maxleiter" />
            <AvatarFallback>LR</AvatarFallback>
            <AvatarBadge>
              <IconAlertCircle className="size-4 text-primary-foreground" />
            </AvatarBadge>
          </Avatar>
          <Avatar size="lg" className="data-[size=lg]:size-12">
            <AvatarImage src="https://github.com/evilrabbit.png" alt="@evilrabbit" />
            <AvatarFallback>ER</AvatarFallback>
            <AvatarBadge className="bg-red-500">
              <IconAlertCircle className="size-4 text-red-500" />
            </AvatarBadge>
          </Avatar>
          <AvatarGroupCount className="group-has-data-[size=lg]/avatar-group:size-12">
            +3
          </AvatarGroupCount>
        </AvatarGroup>
      </div>
    </div>
  )
}

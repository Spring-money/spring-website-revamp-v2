'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface ClientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
}

const DEFAULT_FALLBACK = "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80";

const ClientImage: React.FC<ClientImageProps> = ({ src, alt, fallbackSrc = DEFAULT_FALLBACK, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string | undefined>(src as string | undefined);

    return (
      <Image
        {...props}
        src={imgSrc || fallbackSrc}
        alt={alt || 'Image'}
        width={typeof props.width === 'string' ? Number(props.width) : props.width || 256} // Provide a default width
        height={typeof props.height === 'string' ? Number(props.height) : props.height || 256} // Provide a default height
        onError={() => setImgSrc(fallbackSrc)}
        unoptimized
      />
    );
};

export default ClientImage; 
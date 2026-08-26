import React from 'react';

interface DefaultAvatarProps {
  className?: string;
  src?: string;
  alt?: string;
}

export const DEFAULT_BOTAK_AVATAR = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%239E9898"><path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm0 4c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5zm-6 4c.22-.72 2.7-2 6-2s5.78 1.28 6 2z"/></svg>`;

export const DefaultAvatar: React.FC<DefaultAvatarProps> = ({
  className = "w-16 h-16 rounded-full object-cover border-2 border-[#9E9898]",
  src,
  alt = "Foto Siswa",
}) => {
  const [imgError, setImgError] = React.useState(false);

  const fallbackSrc = DEFAULT_BOTAK_AVATAR;

  return (
    <img
      src={!imgError && src ? src : fallbackSrc}
      alt={alt}
      onError={() => setImgError(true)}
      className={className}
    />
  );
};

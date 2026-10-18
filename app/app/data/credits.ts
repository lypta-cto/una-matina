// Found photographs of the world around the brand (never presented as Una Mattina's own events or food).
// Source of truth for licences: public/img/world/credits.json and public/video/credits.json.
export interface Found { src: string, w: number, h: number, title: string, creator: string, license: string, licenseUrl: string, page: string, changes?: string }
const cc = {
  bysa4: ['CC BY-SA 4.0', 'https://creativecommons.org/licenses/by-sa/4.0/'],
  by2: ['CC BY 2.0', 'https://creativecommons.org/licenses/by/2.0/'],
  cc0: ['CC0', 'https://creativecommons.org/publicdomain/zero/1.0/'],
} as const
const f = (src: string, w: number, h: number, title: string, creator: string, lic: keyof typeof cc, page: string, changes = 'cropped, colour-graded'): Found =>
  ({ src, w, h, title, creator, license: cc[lic][0], licenseUrl: cc[lic][1], page, changes })

// Every entry here is shown somewhere on the site; the footer credits list is generated from it.
// Remove an entry when its picture leaves the site.
export const credits = {
  pier: f('/img/world/naples-pier-sunset-21x9.jpg', 2400, 1029, 'Naples FL pier seen from 8th Avenue Beach at sunset', 'P,TO 19104', 'bysa4', 'https://commons.wikimedia.org/wiki/File:Naples_FL_pier_seen_from_8th_Avenue_Beach_at_sunset.jpg'),
  clamPass: f('/img/world/clam-pass-sunset-4x5.jpg', 960, 1200, 'Sunset at Clam Pass Beach, Naples FL', 'P,TO 19104', 'bysa4', 'https://commons.wikimedia.org/w/index.php?curid=107591103'),
  flowers: f('/img/world/flower-market-buckets-4x5.jpg', 848, 1060, 'Flower market buckets', 'Alisa Anton', 'cc0', 'https://commons.wikimedia.org/w/index.php?curid=61815263'),
  griddle: f('/img/world/crepe-griddle-4x5.jpg', 880, 1100, 'A crêpe on a griddle', 'DanielPenfield', 'bysa4', 'https://commons.wikimedia.org/wiki/File:SimplyCrepesPittsfordMapleCrepesGriddle.jpg'),
  cannoli: f('/img/world/cannoli-tray-4x5.jpg', 880, 1100, 'Cannoli siciliani', 'Stefano Mortellaro', 'by2', 'https://commons.wikimedia.org/w/index.php?curid=385058'),
  lemons: f('/img/world/amalfi-lemons-21x9.jpg', 2400, 1029, 'Amalfi lemons', 'Yvon from Netherlands', 'by2', 'https://commons.wikimedia.org/w/index.php?curid=9524162'),
}

export const heroVideo = {
  poster: '/video/palm-sunset-poster.jpg',
  mp4: '/video/palm-sunset-1280.mp4',
  webm: '/video/palm-sunset-1280.webm',
  mobile: '/video/palm-sunset-720.mp4',
  // ≥ 1200 px (or ≥ 768 px at DPR > 1.5): the 1280 clip would be painted at 1555–2074 CSS px
  largeMp4: '/video/palm-sunset-1920.mp4',
  largeWebm: '/video/palm-sunset-1920.webm',
  posterLarge: '/video/palm-sunset-poster-1920.webp',
  credit: { title: 'Sunset through Palm Tree', creator: 'Johann Mynhardt', license: 'CC BY 2.0', licenseUrl: 'https://creativecommons.org/licenses/by/2.0/', page: 'https://commons.wikimedia.org/wiki/File:Free_video_clip_-_Sunset_through_Palm_Tree.webm', note: 'trimmed and looped' },
}

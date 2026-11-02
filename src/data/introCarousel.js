const fallbackSrc = '/assets/carousel-fallback.svg'
const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=960&q=80`

export const introCarouselItems = [
  {
    src: image('photo-1486406146926-c627a92ad1ab'),
    fallbackSrc,
    alt: 'Modern glass university buildings viewed from below',
    title: 'Architecture',
  },
  {
    src: image('photo-1521737711867-e3b97375f902'),
    fallbackSrc,
    alt: 'Students collaborating around a table',
    title: 'Collaboration',
  },
  {
    src: image('photo-1504384308090-c894fdcc538d'),
    fallbackSrc,
    alt: 'Technology event with people working together',
    title: 'Hackathons',
  },
  {
    src: image('photo-1498050108023-c5249f4df085'),
    fallbackSrc,
    alt: 'Laptop displaying a software development workspace',
    title: 'Development',
  },
  {
    src: image('photo-1519389950473-47ba0277781c'),
    fallbackSrc,
    alt: 'Creative team collaborating around a computer',
    title: 'Creative teams',
  },
  {
    src: image('photo-1528605248644-14dd04022da1'),
    fallbackSrc,
    alt: 'Small group sharing ideas around a table',
    title: 'Ideas',
  },
  {
    src: image('photo-1516321318423-f06f85e504b3'),
    fallbackSrc,
    alt: 'Close view of a laptop and computer workspace',
    title: 'Technology',
  },
  {
    src: image('photo-1497366754035-f200968a6e72'),
    fallbackSrc,
    alt: 'Modern collaborative workspace',
    title: 'Innovation',
  },
]

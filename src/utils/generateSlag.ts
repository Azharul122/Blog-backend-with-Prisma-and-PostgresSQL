function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, '')  
    .replace(/\s+/g, '-')              
    .replace(/-+/g, '-')                
    .replace(/^-+|-+$/g, '');           
}

export default generateSlug;

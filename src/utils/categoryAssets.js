import catRefPendant from '../assets/cat_ref_pendant.png';
import catRefPendantWebp from '../assets/cat_ref_pendant.webp';
import catRefNecklaces from '../assets/cat_ref_necklaces.png';
import catRefNecklacesWebp from '../assets/cat_ref_necklaces.webp';
import catRefMangalsutra from '../assets/cat_ref_mangalsutra.png';
import catRefMangalsutraWebp from '../assets/cat_ref_mangalsutra.webp';
import catRefToeRing from '../assets/cat_ref_toe_ring.png';
import catRefToeRingWebp from '../assets/cat_ref_toe_ring.webp';
import catRefAnklets from '../assets/cat_ref_anklets.png';
import catRefAnkletsWebp from '../assets/cat_ref_anklets.webp';
import catRefChain from '../assets/cat_ref_chain.png';
import catRefChainWebp from '../assets/cat_ref_chain.webp';
import catRefRings from '../assets/cat_ref_rings.png';
import catRefRingsWebp from '../assets/cat_ref_rings.webp';
import catRefEarring from '../assets/cat_ref_earring.png';
import catRefEarringWebp from '../assets/cat_ref_earring.webp';
import catRefBracelets from '../assets/cat_ref_bracelets.png';
import catRefBraceletsWebp from '../assets/cat_ref_bracelets.webp';
import catRefStoneBracelets from '../assets/cat_ref_stone_bracelets.png';
import catRefStoneBraceletsWebp from '../assets/cat_ref_stone_bracelets.webp';

export const getCategoryFallbackImage = (catNameOrId) => {
  const norm = String(catNameOrId || '').toLowerCase().replace(/\s+/g, '');
  if (norm.includes('pendant') || norm.includes('locket')) return catRefPendantWebp || catRefPendant;
  if (norm.includes('necklace') || norm.includes('choker') || norm.includes('haar')) return catRefNecklacesWebp || catRefNecklaces;
  if (norm.includes('mangal')) return catRefMangalsutraWebp || catRefMangalsutra;
  if (norm.includes('toering') || norm.includes('toe-ring') || norm.includes('toe') || norm.includes('bichiya')) return catRefToeRingWebp || catRefToeRing;
  if (norm.includes('anklet') || norm.includes('payal')) return catRefAnkletsWebp || catRefAnklets;
  if (norm.includes('chain')) return catRefChainWebp || catRefChain;
  if (norm.includes('ring')) return catRefRingsWebp || catRefRings;
  if (norm.includes('earring') || norm.includes('jhumka') || norm.includes('bali') || norm.includes('stud')) return catRefEarringWebp || catRefEarring;
  if (norm.includes('stone')) return catRefStoneBraceletsWebp || catRefStoneBracelets;
  if (norm.includes('bracelet')) return catRefBraceletsWebp || catRefBracelets;
  return catRefRingsWebp || catRefRings;
};


import himRings from '../assets/editorial/him_rings.jpg';
import himChains from '../assets/editorial/him_chains.jpg';
import himBracelets from '../assets/editorial/him_bracelets.jpg';
import herRings from '../assets/editorial/her_rings.jpg';
import herBracelets from '../assets/editorial/her_bracelets.jpg';
import herAnklets from '../assets/editorial/her_anklets.jpg';
import kidsBracelets from '../assets/editorial/kids_bracelets.jpg';
import kidsChains from '../assets/editorial/kids_chains.jpg';
import kidsKadas from '../assets/editorial/kids_kadas.jpg';
import giftsCoins from '../assets/editorial/gifts_coins.jpg';
import giftsPooja from '../assets/editorial/gifts_pooja.jpg';
import giftsKeepsakes from '../assets/editorial/gifts_keepsakes.jpg';

// Clean Category Images & Fallbacks
import kadaImg from '../assets/clean_categories/kada.png';
import payalImg from '../assets/clean_categories/payal.png';
import earringsImg from '../assets/clean_categories/earrings.png';
import jhumkasImg from '../assets/jhumkas.png';
import necklacesImg from '../assets/necklaces.png';
import pendantsImg from '../assets/pendants.png';
import silverChainImg from '../assets/clean_categories/silver_chain.png';
import kidsJewelleryImg from '../assets/kids_jewellery.png';
import mensJewelleryImg from '../assets/mens_jewellery.png';
import solitairesImg from '../assets/solitaries.png';
import colRings from '../assets/col_rings.png';
import colBracelets from '../assets/col_bracelets.png';
import colPendants from '../assets/col_pendants.png';
import colChains from '../assets/col_chains.png';
import diamondBracelet from '../assets/diamond_bracelet.png';
import sapphireHeritageSet from '../assets/sapphire_heritage_set.png';
import colToeRingPng from '../assets/col_toe_ring.png';

export const getShowcaseSectionsConfig = ({ navigateTo, changeCategoryTab, setCustomDesignOpen }) => [
  // ==========================================================
  // 01 / FOR HER — WOMEN'S JEWELLERY
  // ==========================================================
  {
    id: 'for-her',
    number: '01 / FOR HER',
    title: "Women's Jewellery",
    subtitle: 'Elegant 925 sterling silver pieces for everyday beauty and royal moments.',
    defaultGender: 'women',
    dark: false,
    categories: [
      { label: 'Bracelets', img: herBracelets, tab: 'bracelets' },
      { label: 'Anklets', img: herAnklets, tab: 'payal' },
      { label: 'Rings', img: herRings, tab: 'rings' },
      { label: 'Ear rings', img: earringsImg, tab: 'earrings' },
      { label: 'Toe Rings', img: colToeRingPng || payalImg, tab: 'payal' },
      { label: 'Chains', img: silverChainImg, tab: 'necklaces' },
      { label: 'Necklaces', img: necklacesImg, tab: 'necklaces' },
      { label: 'Pendants', img: pendantsImg, tab: 'pendant' },
      { label: 'Other', img: diamondBracelet, tab: 'Collections' },
    ],
  },

  // ==========================================================
  // 02 / FOR HIM — MEN'S JEWELLERY
  // ==========================================================
  {
    id: 'for-him',
    number: '02 / FOR HIM',
    title: "Men's Jewellery",
    subtitle: 'Bold 925 sterling silver designs crafted for confidence and royal presence.',
    defaultGender: 'men',
    dark: false,
    categories: [
      { label: 'Kada', img: kadaImg, tab: 'bangles' },
      { label: 'Rings', img: himRings, tab: 'rings' },
      { label: 'Chains', img: himChains, tab: 'necklaces' },
      { label: 'Bracelets', img: himBracelets, tab: 'bracelets' },
      { label: 'Pendants', img: solitairesImg, tab: 'pendant' },
      { label: 'Other', img: mensJewelleryImg, tab: 'Collections' },
    ],
  },

  // ==========================================================
  // 03 / FOR KIDS — LITTLE TREASURES
  // ==========================================================
  {
    id: 'for-kids',
    number: '03 / LITTLE TREASURES',
    title: "Kid's Jewellery",
    subtitle: 'Pure, skin-friendly 925 silver keepsakes handcrafted for your little precious ones.',
    defaultGender: 'kids',
    dark: false,
    categories: [
      { label: 'Bornbaby Kit', img: kidsJewelleryImg, tab: 'Collections' },
      { label: 'Chains', img: kidsChains, tab: 'necklaces' },
      { label: 'Pendants', img: pendantsImg, tab: 'pendant' },
      { label: 'Bracelets & Berwa', img: kidsBracelets, tab: 'bracelets' },
      { label: 'Other', img: kidsKadas, tab: 'Collections' },
    ],
  },

  // ==========================================================
  // 04 / COUPLE'S SECTION
  // ==========================================================
  {
    id: 'couples-section',
    number: "04 / COUPLE'S SUITE",
    title: "Couple's Collection",
    subtitle: 'Matching sterling silver designs crafted to celebrate sacred bonds.',
    defaultGender: null,
    dark: false,
    categories: [
      { label: 'Couple Rings', img: herRings, tab: 'rings' },
      { label: 'Couple Chains', img: himChains, tab: 'necklaces' },
      { label: 'Couple Bracelets', img: herBracelets, tab: 'bracelets' },
      { label: 'Secret Sets', img: giftsKeepsakes, tab: 'Collections' },
      { label: 'Others', img: solitairesImg, tab: 'Collections' },
    ],
  },

  // ==========================================================
  // 05 / GIFT'S COLLECTION
  // ==========================================================
  {
    id: 'gifts-collection',
    number: '05 / GIFTS & CELEBRATION',
    title: "Gift's Collection",
    subtitle: 'Thoughtful 925 silver gift sets, bespoke pieces, and memorable keepsakes.',
    defaultGender: null,
    dark: false,
    categories: [
      { label: 'Born Baby Kit', img: kidsJewelleryImg, tab: 'Collections' },
      { label: 'Couples things', img: giftsCoins, tab: 'Collections' },
      { label: 'Add Your Fav.', img: giftsKeepsakes, action: () => setCustomDesignOpen?.(true) },
    ],
  },
];

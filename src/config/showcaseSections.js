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

export const getShowcaseSectionsConfig = ({ navigateTo, changeCategoryTab, setCustomDesignOpen }) => [
  // ==========================================================
  // PAGE 03 IN RECORDING: 01 / FOR HER — WOMEN'S JEWELLERY
  // ==========================================================
  {
    id: 'for-her',
    number: '01 / FOR HER',
    title: "Women's Jewellery",
    subtitle: 'Elegant 925 sterling silver pieces for everyday beauty and royal moments.',
    defaultGender: 'women',
    dark: false,
    categories: [
      { label: 'Rings', img: herRings, tab: 'Rings' },
      { label: 'Anklets', img: herAnklets, tab: 'Payal' },
      { label: 'Bracelets', img: herBracelets, tab: 'Bracelets' },
      { label: 'Earrings', img: jhumkasImg, tab: 'Earrings' },
      { label: 'Toe Rings', img: payalImg, tab: 'Payal' },
      { label: 'Chains', img: silverChainImg, tab: 'Necklaces' },
      { label: 'Necklaces', img: necklacesImg, tab: 'Necklaces' },
      { label: 'Pendants', img: pendantsImg, tab: 'Pendants' },
      { label: 'Other', img: diamondBracelet, tab: 'Collections' },
    ],
    curatedItems: [
      { id: 'her-c-1', name: 'Eternal Solitaire Ring', price: '₹1,899', originalPrice: '₹2,799', img: herRings, tab: 'Rings' },
      { id: 'her-c-2', name: 'Dewdrop Silver Payal', price: '₹2,499', originalPrice: '₹3,599', img: herAnklets, tab: 'Payal' },
      { id: 'her-c-3', name: 'Lustre Charm Bracelet', price: '₹2,199', originalPrice: '₹3,199', img: herBracelets, tab: 'Bracelets' },
      { id: 'her-c-4', name: 'Jadau Filigree Jhumkis', price: '₹3,299', originalPrice: '₹4,599', img: jhumkasImg, tab: 'Earrings' },
    ]
  },

  // ==========================================================
  // PAGE 04 IN RECORDING: 02 / FOR HIM — MEN'S JEWELLERY
  // ==========================================================
  {
    id: 'for-him',
    number: '02 / FOR HIM',
    title: "Men's Jewellery",
    subtitle: 'Bold 925 sterling silver designs crafted for confidence and royal presence.',
    defaultGender: 'men',
    dark: false,
    categories: [
      { label: 'Kada', img: kadaImg, tab: 'Bangles' },
      { label: 'Rings', img: himRings, tab: 'Rings' },
      { label: 'Chains', img: himChains, tab: 'Necklaces' },
      { label: 'Bracelets', img: himBracelets, tab: 'Bracelets' },
      { label: 'Pendants', img: solitairesImg, tab: 'Pendants' },
      { label: 'Other', img: mensJewelleryImg, tab: 'Collections' },
    ],
    curatedItems: [
      { id: 'him-c-1', name: 'Royal Rajputi Silver Kada', price: '₹3,499', originalPrice: '₹4,999', img: kadaImg, tab: 'Bangles' },
      { id: 'him-c-2', name: 'Heavy Curb Silver Chain', price: '₹4,299', originalPrice: '₹5,999', img: himChains, tab: 'Necklaces' },
      { id: 'him-c-3', name: 'Onyx Sovereign Signet Ring', price: '₹1,999', originalPrice: '₹2,899', img: himRings, tab: 'Rings' },
      { id: 'him-c-4', name: 'Solid Link Cuban Bracelet', price: '₹2,899', originalPrice: '₹3,999', img: himBracelets, tab: 'Bracelets' },
    ]
  },

  // ==========================================================
  // PAGE 05 IN RECORDING: 03 / LITTLE TREASURES — KID'S JEWELLERY
  // ==========================================================
  {
    id: 'kids-collection',
    number: '03 / LITTLE TREASURES',
    title: "Kid's Jewellery",
    subtitle: 'Pure, skin-friendly 925 silver keepsakes handcrafted for your little precious ones.',
    defaultGender: 'kids',
    dark: false,
    categories: [
      { label: 'Born Baby Kit', img: kidsJewelleryImg, tab: 'Collections' },
      { label: 'Nazariya & Bracelets', img: kidsBracelets, tab: 'Bracelets' },
      { label: 'Chains', img: kidsChains, tab: 'Necklaces' },
      { label: 'Pendants', img: pendantsImg, tab: 'Pendants' },
      { label: 'Baby Kadas', img: kidsKadas, tab: 'Bangles' },
      { label: 'Other', img: kidsJewelleryImg, tab: 'Collections' },
    ],
    curatedItems: [
      { id: 'kid-c-1', name: 'Silver Nazariya Beads Bracelet', price: '₹799', originalPrice: '₹1,199', img: kidsBracelets, tab: 'Bracelets' },
      { id: 'kid-c-2', name: 'Baby Elephant Charm Kada', price: '₹1,299', originalPrice: '₹1,899', img: kidsKadas, tab: 'Bangles' },
      { id: 'kid-c-3', name: 'Little Moon Silver Pendant', price: '₹899', originalPrice: '₹1,299', img: kidsChains, tab: 'Pendants' },
      { id: 'kid-c-4', name: 'Born Baby Auspicious Spoon & Bowl', price: '₹2,499', originalPrice: '₹3,499', img: kidsJewelleryImg, tab: 'Collections' },
    ]
  },

  // ==========================================================
  // PAGE 06 IN RECORDING: 04 / SACRED & CELEBRATION — GIFT'S & COUPLES
  // ==========================================================
  {
    id: 'gifts-collection',
    number: '04 / SACRED & CELEBRATION',
    title: "Gift's & Couples Collection",
    subtitle: 'Auspicious 999 fine silver coins, couple sets, sacred pooja articles, and royal keepsakes.',
    defaultGender: null,
    dark: false,
    categories: [
      { label: 'Born Baby Kit', img: kidsJewelleryImg, action: () => { changeCategoryTab?.('Collections'); navigateTo?.('collections'); } },
      { label: 'Couple Rings', img: herRings, tab: 'Rings' },
      { label: 'Couple Chains', img: himChains, tab: 'Necklaces' },
      { label: 'Silver Coins 999', img: giftsCoins, action: () => navigateTo?.('gold-coins') },
      { label: 'Sacred Pooja Articles', img: giftsPooja, tab: 'Silver' },
      { label: 'Secret Sets', img: giftsKeepsakes, tab: 'Collections' },
      { label: 'Add Your Fav.', img: solitairesImg, action: () => setCustomDesignOpen?.(true) },
    ],
    curatedItems: [
      { id: 'gift-c-1', name: 'Laxmi Ganesh Pure 999 Silver Coin', price: '₹1,499', originalPrice: '₹1,999', img: giftsCoins, action: () => navigateTo?.('gold-coins') },
      { id: 'gift-c-2', name: 'Twin Soul Sterling Couple Rings', price: '₹2,999', originalPrice: '₹4,199', img: herRings, tab: 'Rings' },
      { id: 'gift-c-3', name: 'Silver Puja Bell & Aarti Thali', price: '₹4,899', originalPrice: '₹6,499', img: giftsPooja, tab: 'Silver' },
      { id: 'gift-c-4', name: 'Royal Velvet Keepsake Treasure', price: '₹3,199', originalPrice: '₹4,499', img: giftsKeepsakes, tab: 'Collections' },
    ]
  },

  // ==========================================================
  // ACCESSORIES SECTION
  // ==========================================================
  {
    id: 'accessories-collection',
    number: '05 / ACCESSORIES',
    title: 'Silver Accessories',
    subtitle: 'Pure 999 silver coins, royal cufflinks, brooches, pooja articles, and everyday sterling silver essentials.',
    defaultGender: null,
    dark: false,
    categories: [
      { label: 'Silver Coins', img: giftsCoins, action: () => navigateTo?.('gold-coins') },
      { label: 'Cufflinks', img: giftsKeepsakes, tab: 'Collections' },
      { label: 'Brooches', img: diamondBracelet, tab: 'Collections' },
      { label: 'Chhala & Rings', img: colRings, tab: 'Rings' },
      { label: 'Tie Pins', img: colChains, tab: 'Collections' },
      { label: 'Religious Articles', img: giftsPooja, tab: 'Silver' },
      { label: 'Other', img: solitairesImg, tab: 'Collections' },
    ],
    curatedItems: [
      { id: 'acc-c-1', name: 'Royal Rajputi Silver Cufflinks', price: '₹1,899', originalPrice: '₹2,699', img: giftsKeepsakes, tab: 'Collections' },
      { id: 'acc-c-2', name: 'Silver Peacock Sari Brooch', price: '₹2,199', originalPrice: '₹2,999', img: diamondBracelet, tab: 'Collections' },
      { id: 'acc-c-3', name: 'Pure 999 Silver Bar 50g', price: '₹4,699', originalPrice: '₹5,499', img: giftsCoins, action: () => navigateTo?.('gold-coins') },
      { id: 'acc-c-4', name: 'Hand-carved Silver Chhala', price: '₹999', originalPrice: '₹1,499', img: colRings, tab: 'Rings' },
    ]
  },
];

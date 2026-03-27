import { create } from 'zustand';
import { collection, doc, setDoc, deleteDoc, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export type Complex = '갤러리아포레' | '아크로서울포레스트' | '트리마제';
export type TransactionType = '매매' | '전세' | '월세';

export interface Listing {
  id: string;
  title: string;
  complex: Complex;
  type: TransactionType;
  size: string;
  price: string;
  address: string;
  approvalDate: string;
  purpose: string;
  parking: string;
  floor: string;
  dong: string;
  area: string;
  roomsBaths: string;
  maintenanceFee: string;
  direction: string;
  moveInDate: string;
  images: string[];
  thumbnail: string;
  isPublic: boolean;
  isRecommended: boolean;
  createdAt: number;
}

export interface ComplexData {
  id: string;
  name: string;
  title: string;
  desc: string;
  image: string;
  floorPlans: { name: string; image: string }[];
  community: string[];
}

interface AppState {
  isAdmin: boolean;
  setAdmin: (status: boolean) => void;
  logout: () => void;
  
  isInitialized: boolean;
  
  listings: Listing[];
  addListing: (listing: Omit<Listing, 'id' | 'createdAt'>) => Promise<void>;
  updateListing: (id: string, listing: Partial<Listing>) => Promise<void>;
  deleteListing: (id: string) => Promise<void>;

  complexes: Record<string, ComplexData>;
  updateComplex: (id: string, data: Partial<ComplexData>) => Promise<void>;
  
  settings: {
    heroImage: string;
    seoTitle: string;
    seoDescription: string;
    snsLinks: {
      instagram: string;
      blog: string;
      youtube: string;
      tiktok: string;
      homepage: string;
    };
  };
  updateSettings: (settings: Partial<AppState['settings']>) => Promise<void>;
}

const initialComplexes: Record<string, ComplexData> = {
  galleria: {
    id: 'galleria',
    name: '갤러리아포레',
    title: '서울숲과 한강을 품은 랜드마크',
    desc: '성수동의 스카이라인을 바꾼 하이엔드 주거의 시작. 230세대 모두가 남향으로 배치되어 서울숲과 한강의 파노라마 뷰를 누릴 수 있습니다.',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    floorPlans: [
      { name: '70평형', image: '' },
      { name: '80평형', image: '' },
      { name: '90평형', image: '' },
      { name: '100평형', image: '' },
      { name: '펜트하우스', image: '' }
    ],
    community: ['수영장', '골프연습장', '피트니스', '사우나', '연회장', '게스트하우스']
  },
  acro: {
    id: 'acro',
    name: '아크로서울포레스트',
    title: '하이엔드 주거의 새로운 기준',
    desc: 'T자형 건물 배치로 세대 간 프라이버시를 극대화하고, 아트 프레임 창을 통해 서울숲과 한강을 한 폭의 그림처럼 담아냅니다.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    floorPlans: [
      { name: '37평형', image: '' },
      { name: '66평형', image: '' },
      { name: '77평형', image: '' },
      { name: '펜트하우스', image: '' }
    ],
    community: ['클럽 아크로', '피트니스', '사우나', '실내골프장', '펫케어룸', '연회장']
  },
  trimage: {
    id: 'trimage',
    name: '트리마제',
    title: '호텔식 서비스가 제공되는 프리미엄 아파트',
    desc: '조식 서비스, 발렛파킹, 컨시어지 등 최고급 호텔 수준의 서비스를 제공하며, 한강변에 위치해 탁월한 조망권을 자랑합니다.',
    image: 'https://images.unsplash.com/photo-1600566753086-00f18efc2291?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
    floorPlans: [
      { name: '11평형', image: '' }, { name: '16평형', image: '' }, { name: '22평형', image: '' },
      { name: '28평형', image: '' }, { name: '38A평형', image: '' }, { name: '38B평형', image: '' },
      { name: '38C평형', image: '' }, { name: '56평형', image: '' }, { name: '57평형', image: '' },
      { name: '62평형', image: '' }, { name: '88펜트', image: '' }
    ],
    community: ['조식라운지', '스파', '피트니스', '실내골프장', '북카페', '비즈니스라운지']
  }
};

const defaultSettings = {
  heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80',
  seoTitle: '하이클래스 부동산 | 갤러리아포레 단독입점',
  seoDescription: '갤러리아포레, 아크로서울포레스트, 트리마제 전문 하이클래스 부동산입니다. 엄선된 프리미엄 매물만 제공합니다.',
  snsLinks: {
    instagram: 'https://instagram.com/highclass.realty',
    blog: 'https://blog.naver.com/rnrqjs1201',
    youtube: 'https://youtube.com/하이클래스부동산',
    tiktok: 'https://tiktok.com/@highclass.tv',
    homepage: 'https://highclasskorea.com'
  }
};

export const useStore = create<AppState>((set, get) => ({
  isAdmin: false,
  setAdmin: (status) => set({ isAdmin: status }),
  logout: () => {
    import('../firebase').then(({ logOut }) => {
      logOut().then(() => set({ isAdmin: false }));
    });
  },
  
  isInitialized: false,
  
  listings: [],
  addListing: async (listing) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newListing = { ...listing, id, createdAt: Date.now() };
    await setDoc(doc(db, 'listings', id), newListing);
  },
  updateListing: async (id, updatedListing) => {
    const currentListing = get().listings.find(l => l.id === id);
    if (currentListing) {
      await setDoc(doc(db, 'listings', id), { ...currentListing, ...updatedListing }, { merge: true });
    }
  },
  deleteListing: async (id) => {
    await deleteDoc(doc(db, 'listings', id));
  },

  complexes: initialComplexes,
  updateComplex: async (id, data) => {
    const currentComplex = get().complexes[id];
    if (currentComplex) {
      await setDoc(doc(db, 'complexes', id), { ...currentComplex, ...data }, { merge: true });
    }
  },
  
  settings: defaultSettings,
  updateSettings: async (newSettings) => {
    const currentSettings = get().settings;
    await setDoc(doc(db, 'settings', 'global'), { ...currentSettings, ...newSettings }, { merge: true });
  }
}));

// Initialize Firebase Listeners
let isListening = false;
export const initFirebaseListeners = () => {
  if (isListening) return;
  isListening = true;

  let listingsLoaded = false;
  let complexesLoaded = false;
  let settingsLoaded = false;

  const checkInitialized = () => {
    if (listingsLoaded && complexesLoaded && settingsLoaded) {
      useStore.setState({ isInitialized: true });
    }
  };

  // Fallback timeout to prevent infinite loading if Firebase is blocked or slow
  setTimeout(() => {
    useStore.setState({ isInitialized: true });
  }, 1500);

  import('../firebase').then(({ auth, onAuthStateChanged }) => {
    onAuthStateChanged(auth, (user) => {
      if (user && user.email === 'soinvu.com@gmail.com') {
        useStore.setState({ isAdmin: true });
      } else {
        useStore.setState({ isAdmin: false });
      }
    });
  });

  // Listen to listings
  onSnapshot(collection(db, 'listings'), (snapshot) => {
    const listings: Listing[] = [];
    snapshot.forEach((doc) => {
      listings.push(doc.data() as Listing);
    });
    // Sort by createdAt descending
    listings.sort((a, b) => b.createdAt - a.createdAt);
    useStore.setState({ listings });
    listingsLoaded = true;
    checkInitialized();
  }, (error) => {
    console.error('Error fetching listings:', error);
    listingsLoaded = true;
    checkInitialized();
  });

  // Listen to complexes
  onSnapshot(collection(db, 'complexes'), (snapshot) => {
    if (!snapshot.empty) {
      const complexes = { ...initialComplexes };
      snapshot.forEach((doc) => {
        complexes[doc.id] = doc.data() as ComplexData;
      });
      useStore.setState({ complexes });
    } else {
      // Seed initial complexes if empty
      Object.values(initialComplexes).forEach(async (complex) => {
        await setDoc(doc(db, 'complexes', complex.id), complex);
      });
    }
    complexesLoaded = true;
    checkInitialized();
  }, (error) => {
    console.error('Error fetching complexes:', error);
    complexesLoaded = true;
    checkInitialized();
  });

  // Listen to settings
  onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
    if (docSnap.exists()) {
      useStore.setState({ settings: docSnap.data() as AppState['settings'] });
    } else {
      // Seed initial settings
      setDoc(doc(db, 'settings', 'global'), defaultSettings);
    }
    settingsLoaded = true;
    checkInitialized();
  }, (error) => {
    console.error('Error fetching settings:', error);
    settingsLoaded = true;
    checkInitialized();
  });
};

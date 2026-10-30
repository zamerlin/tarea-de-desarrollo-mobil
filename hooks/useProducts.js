import { useCallback, useEffect, useRef, useState } from 'react';

const PRODUCTS_URL = 'https://6ae4f63a28393034b08e0e91.mockapi.io/api/tienda-magica/objetos';
const productColors = ['#DCEBFF', '#FCE5D7', '#E3F3E9', '#FFF0C7', '#F0E2F8', '#E5E5E5'];
const productAccents = ['#2D6CDF', '#D9663D', '#388A5B', '#B57916', '#8650A8', '#4C5561'];
const localMovieImages = {
  digimonourwargame: require('../assets/products/digimon_our_war_game-CXZKWFI8.jpg'),
  glassnohanatokowasusekai: require('../assets/products/glass-no-hana-to-kowasu-sekai.jpg'),
  gundam00trailblazer: require('../assets/products/gundam_00_trailblazer-C-sotOTx.jpg'),
  kiminonawa: require('../assets/products/kimi-no-na-wa.jpg'),
  macrossfitsuwarinoutahime: require('../assets/products/macross-f-itsuwari-no-utahime.jpg'),
  violetevergarden: require('../assets/products/violet_evergarden-DXlltCxv.jpg'),
  macrossfsayonaranotsubasa: require('../assets/products/macross-f-sayonara-no-tsubasa.jpg'),
  macrossaioboeteimasuka: require('../assets/products/macross_ai_oboete_imasuka-ZB5fwCX9.jpg'),
  gundamgyakushuunochar: require('../assets/products/mobile-suit-gundam-gyakushuu-no-char.jpg'),
  nogamenolifezero: require('../assets/products/no_game_no_life_zero-Ci8OlDpr.jpg'),
  pokemonmewtwovsmew: require('../assets/products/pokemon-p01-mewtwo-vs-mew.jpg'),
  pokemonyoteelijo: require('../assets/products/pokemon-p20-yo-te-elijo.jpg'),
  gurrenlagannlagannhen: require('../assets/products/tengen-toppa-gurren-lagann-lagann-hen.jpg'),
  gurrenlaganngurrenhen: require('../assets/products/tengen_toppa_gurren_lagann_gurren_hen-DbZclmGA.jpg'),
};
const localMovieImagesByKey = {
  digimonourwargamecxzkwfi8jpg: localMovieImages.digimonourwargame,
  glassnohanatokowasusekaijpg: localMovieImages.glassnohanatokowasusekai,
  gundam00trailblazercsototxjpg: localMovieImages.gundam00trailblazer,
  kiminonawajpg: localMovieImages.kiminonawa,
  macrossfitsuwarinoutahimejpg: localMovieImages.macrossfitsuwarinoutahime,
  macrossfsayonaranotsubasajpg: localMovieImages.macrossfsayonaranotsubasa,
  macrossaioboeteimasukazb5fwcx9jpg: localMovieImages.macrossaioboeteimasuka,
  mobilesuitgundamgyakushuunocharjpg: localMovieImages.gundamgyakushuunochar,
  nogamenolifezeroci8oldprjpg: localMovieImages.nogamenolifezero,
  pokemonp01mewtwovsmewjpg: localMovieImages.pokemonmewtwovsmew,
  pokemonp20yoteelijojpg: localMovieImages.pokemonyoteelijo,
  tengentoppagurrenlagannlagannhenjpg: localMovieImages.gurrenlagannlagannhen,
  tengentoppagurrenlaganngurrenhendbzclmgajpg: localMovieImages.gurrenlaganngurrenhen,
  violetevergardendxlltcxvjpg: localMovieImages.violetevergarden,
};

function normalizeTitle(title) {
  return title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

function normalizeProduct(product, index) {
  const name = product?.name ?? product?.nombre ?? product?.title ?? product?.titulo;
  const rawPrice = product?.price ?? product?.precio;
  const price = typeof rawPrice === 'number' ? rawPrice : Number(rawPrice);
  const rawCategory = product?.category ?? product?.categoria ?? product?.genre ?? product?.genero;
  const rawDescription = product?.description ?? product?.descripcion;
  const rawImage = product?.image ?? product?.imagen ?? product?.imageUrl ?? product?.foto;
  const rawImageKey = product?.key ?? product?.imageKey;
  const image = typeof rawImage === 'string' && rawImage.trim()
    ? { uri: rawImage.trim() }
    : localMovieImagesByKey[normalizeTitle(rawImageKey || '')]
      || localMovieImages[normalizeTitle(name || '')]
      || null;

  if (
    !product
    || (typeof product.id !== 'number' && typeof product.id !== 'string')
    || !String(product.id).trim()
    || typeof name !== 'string'
    || !name.trim()
    || rawPrice === undefined
    || rawPrice === null
    || rawPrice === ''
    || !Number.isFinite(price)
  ) {
    throw new Error('Cada objeto debe tener id, nombre (o name) y precio (o price) válido.');
  }

  const paletteIndex = index % productColors.length;

  return {
    id: String(product.id),
    name: name.trim(),
    description: typeof rawDescription === 'string' ? rawDescription : '',
    category: typeof rawCategory === 'string' && rawCategory.trim() ? rawCategory.trim() : 'General',
    price,
    image,
    color: product.color || productColors[paletteIndex],
    accent: product.accent || productAccents[paletteIndex],
  };
}

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [requestNumber, setRequestNumber] = useState(0);
  const hasLoaded = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    const isInitialLoad = !hasLoaded.current;
    setLoading(isInitialLoad);
    setRefreshing(!isInitialLoad);
    setError(null);

    async function loadProducts() {
      try {
        const response = await fetch(PRODUCTS_URL, { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`La API respondió con el estado ${response.status}.`);
        }

        const result = await response.json();
        if (!Array.isArray(result)) {
          throw new Error('La API no devolvió una lista de productos.');
        }

        const loadedProducts = result.map(normalizeProduct);
        setProducts(loadedProducts);
        hasLoaded.current = true;
      } catch (loadError) {
        if (loadError?.name !== 'AbortError') {
          setError(loadError instanceof Error ? loadError.message : 'No se pudieron cargar los productos.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [requestNumber]);

  const refresh = useCallback(() => {
    setRequestNumber((current) => current + 1);
  }, []);

  return { products, loading, refreshing, error, refresh };
}

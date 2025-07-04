import React, { useState, SyntheticEvent } from 'react';
import './StickerPicker.css';
import { Grid } from '@giphy/react-components';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { IGif } from '@giphy/js-types';

// TODO: Giphy API anahtarınızı buraya ekleyin.
const giphyFetch = new GiphyFetch('YOUR_GIPHY_API_KEY');

interface StickerPickerProps {
  onStickerSelect: (url: string) => void;
}

const curatedStickers = [
  // Estetik ve sevimli stickerlar (Örnekler)
  'https://placehold.co/100x100/F4B4C3/FFFFFF?text=Cute-1',
  'https://placehold.co/100x100/A2D2FF/FFFFFF?text=Pastel-2',
  'https://placehold.co/100x100/BDE0FE/FFFFFF?text=Blue-Sky',
  'https://placehold.co/100x100/FFD6A5/FFFFFF?text=Sunny',
  'https://placehold.co/100x100/CDB4DB/FFFFFF?text=Lilac',
  'https://placehold.co/100x100/FFC8DD/FFFFFF?text=Pinky',
  'https://placehold.co/100x100/80ED99/FFFFFF?text=Mint',
  'https://placehold.co/100x100/FFBFB5/FFFFFF?text=Coral',
];

const GiphyGrid = ({ onGifClick }: { onGifClick: (gif: IGif, e: SyntheticEvent<HTMLElement, Event>) => void }) => {
  const [term, setTerm] = useState('stickers');
  const fetchGifs = (offset: number) => giphyFetch.search(term, { offset, limit: 10, type: 'stickers' });
  
  return (
    <div className="giphy-container">
        {/* SearchBar'ın onSearch prop'u yok, bu yüzden manuel bir input ile yönetmek daha basit olabilir */}
        {/* Şimdilik, term state'ini güncelleyen bir input ekleyelim */}
        <input 
            type="text" 
            placeholder="Giphy'de sticker ara..." 
            onChange={(e) => setTerm(e.target.value)} 
            defaultValue={term}
            className="giphy-search-bar"
        />
        <Grid
            key={term}
            onGifClick={onGifClick}
            fetchGifs={fetchGifs}
            width={300}
            columns={3}
            gutter={6}
        />
    </div>
  );
};

const StickerPicker: React.FC<StickerPickerProps> = ({ onStickerSelect }) => {
  const [activeTab, setActiveTab] = useState('curated');

  return (
    <div className="sticker-picker-container">
      <div className="sticker-picker-tabs">
        <button 
          className={`sticker-picker-tab ${activeTab === 'curated' ? 'active' : ''}`}
          onClick={() => setActiveTab('curated')}
        >
          Özel
        </button>
        <button 
          className={`sticker-picker-tab ${activeTab === 'giphy' ? 'active' : ''}`}
          onClick={() => setActiveTab('giphy')}
        >
          Giphy
        </button>
      </div>

      <div className="sticker-picker-content">
        {activeTab === 'curated' && (
          <div className="sticker-grid">
            {curatedStickers.map((sticker, index) => (
              <div key={index} className="sticker-item" onClick={() => onStickerSelect(sticker)}>
                <img src={sticker} alt={`Sticker ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        )}
        {activeTab === 'giphy' && (
            <GiphyGrid onGifClick={(gif, e) => {
                e.preventDefault();
                onStickerSelect(gif.images.original.url);
            }} />
        )}
      </div>
    </div>
  );
};

export default StickerPicker;

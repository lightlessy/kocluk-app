
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import JSONResponse
import joblib
import numpy as np
import os
import traceback
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()


origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- CORS Middleware Son ---

class PredictionRequest(BaseModel):
    mode: str
    alan: str
    year: int
    features: List[float]

@app.post("/api")
async def calculate(request: PredictionRequest):
    # Bu fonksiyonun loglarını Vercel Dashboard -> Proje -> Functions -> Logs altında görebilirsiniz.
    print("--- Yeni İstek Geldi ---")
    try:
        # Adım 1: İstek verisini al ve logla
        data = request.dict()
        print(f"Gelen veri: {data}")

        # Adım 2: Gerekli parametreleri al
        mode = data.get('mode')
        alan = data.get('alan')
        year = data.get('year')
        features = data.get('features')

        # Pydantic modeli zaten doğrulamayı yapıyor ama yine de kontrol edelim
        if not all([mode, alan, year, features]):
            print(f"Hata: Eksik parametreler.")
            raise HTTPException(status_code=400, detail="Eksik parametreler: mode, alan, year ve features zorunludur.")

        # Adım 3: Model dosyasının yolunu oluştur
        model_name = f"{year}_{mode}_{alan}_modeli.joblib"
        
        # Vercel ortamında, çalışma dizini /var/task olur. 
        # Bu betik api/main.py içinde olduğundan, py_models'e ulaşmak için bir üst dizine çıkmalıyız.
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, '..', 'py_models', model_name)
        print(f"Hesaplanan mutlak model yolu: {model_path}")

        # Adım 4: Model dosyasının varlığını kontrol et
        if not os.path.exists(model_path):
            print(f"Hata: Model dosyası bulunamadı! -> {model_path}")
            raise HTTPException(status_code=404, detail=f"Model dosyası bulunamadı: {model_name}")
        
        print("Model dosyası diskte bulundu.")

        # Adım 5: Modeli yükle ve tahmin yap
        try:
            model = joblib.load(model_path)
            print("Model başarıyla yüklendi.")
            
            input_data = np.array(features).reshape(1, -1) # Modeller genellikle 2D array bekler
            print(f"Tahmin için girdi verisi (şekil: {input_data.shape}): {input_data}")

            prediction = model(input_data)
            print(f"Tahmin başarılı. Sonuç: {prediction}")

            print("--- İstek Başarıyla Tamamlandı ---")
            return JSONResponse(content={'prediction': prediction.tolist()})

        except Exception as e:
            print(f"Hata: Model yüklenirken veya tahmin yapılırken bir sorun oluştu.")
            print(f"Detay: {e}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"Model hesaplaması sırasında hata: {str(e)}")

    except Exception as e:
        print(f"Hata: Ana işlem bloğunda beklenmedik bir hata oluştu.")
        print(f"Detay: {e}")
        print(traceback.format_exc())
        print("--- İstek Hatayla Sonuçlandı ---")
        # HTTPException'dan gelmiyorsa genel bir 500 hatası döndür
        if not isinstance(e, HTTPException):
            raise HTTPException(status_code=500, detail=f"Sunucuda genel bir hata oluştu: {str(e)}")
        raise e

# Vercel'in beklentilerine uygun olması için, app değişkeninin global kapsamda olması önemlidir.
# Yerel geliştirme için uvicorn ile çalıştırmak isterseniz:
# uvicorn api.main:app --reload

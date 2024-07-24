'use client'
import { format } from "date-fns";
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import React, { ChangeEvent } from "react";

import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { useQuery } from "react-query";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtUtjxijwxTFgrCKzaqzeB4OjK6rF5Drg",
  authDomain: "hondacity-e7979.firebaseapp.com",
  databaseURL: "https://hondacity-e7979-default-rtdb.firebaseio.com",
  projectId: "hondacity-e7979",
  storageBucket: "hondacity-e7979.appspot.com",
  messagingSenderId: "252561046587",
  appId: "1:252561046587:web:77e6427b6afd2ca20ab01e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const database = getFirestore(app)
const storage = getStorage(app)

interface I {
  parcela: number
  data: string
  valor: number
  comprovante: string
}



export default function Home() {
  const key = 'comprovant'
  const [file, setFile] = React.useState<any>(null)
  const [value, setValue] = React.useState('')

  const colllectionName = collection(database, key)

  const uploadImage = React.useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setFile(e.target.files[0])
      }
    },
    [],
  )

  async function getDocumentos() {
    const rs = await getDocs(colllectionName).then(h => {
      const dc = h.docs.map(h => h.data() as I)

      return dc as I[]
    })


    return rs
  }

  // React.useEffect(() => {
  //   getDocumentos()
  // }, [])

  const { data: documento = [] } = useQuery({
    queryKey: ['docs'],
    queryFn: getDocumentos,
  })


  async function addNota() {
    try {

      const imageRef = ref(storage, `comprovante/${documento.length === 0 ? 1 : documento.length}`)

      let imageUrl = null
      await uploadBytes(imageRef, file).then(async (h) => {
        const plant = await getDownloadURL(imageRef)
        imageUrl = plant
      })


      await addDoc(colllectionName, {
        parcela: documento.length + 1,
        data: format(new Date(), 'dd/MM/ HH:mm'),
        valor: Number(value),
        comprovante: imageUrl
      })


      alert('Documento dalvo com sucesso')


    } catch (error) {
      alert('ocorreu algum erro ao salvar os dados')
    }
  }

  const currentValor = documento.reduce((acc, i) => acc + i.valor, 0)

  function converValor(valor: number) {
    const formated = valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })

    return formated
  }


  return (

    <div className="flex flex-col p-4 ">
      <div className="flex flex-col items-center justify-center w-fulls gap-3" >
        <input
          onChange={uploadImage}
          type="file"
          placeholder=""
          name="plant"
        />

        <input className="text-gray-900" type="text" placeholder="valor transferencia" onChange={h => setValue(h.currentTarget.value)} value={value} />
        <button className="bg-green-700 p-2 px-4 rounded-md" onClick={addNota} >Salvar documento</button>
      </div>
      <p className="m-4 text-2 text-center">Manutenção do veículo Honda city - 2010</p>
      <div className="p-10 gap-2  bg-slate-900 items-center flex flex-col" >
        <div className="flex flex-col w-full" >
          <h1 className="font-black text-[6.5svw] text-orange-500">Meta de pagamento: </h1>
          <h1>R$ 13.480,47</h1>

        </div>

        <div className="flex flex-col w-full" >
          <h2 className="font-bold text-[3.5svw]" >Valor pago até o momento: </h2>
          <h2 className="font-bold text-emerald-400 text-[3.5svw]" >{converValor(currentValor)}</h2>

        </div>
      </div>

      <div className="p-2 m-4  bg-gray-900 items-center flex flex-col mt-8" >
        <h1 className="font-black text-[3.5svw] text-gray-400" >Comprovantes de pagamento</h1>
      </div>

      <table className="rounded-lg divide-y divide-gray-900">
        <thead className="bg-gray-700">
          <tr>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcela</th>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comprovante</th>
            <th scope="col" className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
          </tr>
        </thead>
        <tbody className="bg-gray-800 divide-y divide-gray-200">
          {documento.map((h, i) => (
            <tr key={i}>
              <td className="px-2 py-4 text-[14px] whitespace-nowrap">
                <h4 className="text-[10px]" >{h.parcela}</h4>

              </td>
              <td className="px-2 py-4 text-[14px] whitespace-nowrap">
                <h4 className="text-[10px]" >{h.valor}</h4>
              </td>
              <td className="px-2 py-4 text-[14px] whitespace-nowrap">

                <a href={h.comprovante} className="text-indigo-600 hover:text-indigo-900">comprovante</a>
              </td>
              <td className="px-2 py-4 text-[14px] whitespace-nowrap">
                <h4 className="text-[10px]" >{h.data}</h4>
              </td>
            </tr>

          ))}
        </tbody>
      </table>
    </div>
  );
}

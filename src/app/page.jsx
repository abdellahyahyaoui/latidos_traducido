import PoesiaData from "../public/data/poesia.json"
import AutoresData from "../public/data/autores.json"
import CartasEsperanzaData from "../public/data/cartas-esperanza.json"

export default function Page() {
  return (
    <div>
      <h1>Welcome!</h1>
      <p>This is a placeholder page. You can import and render components or data here.</p>
      <h2>Poesia Data:</h2>
      <pre>{JSON.stringify(PoesiaData, null, 2)}</pre>
      <h2>Autores Data:</h2>
      <pre>{JSON.stringify(AutoresData, null, 2)}</pre>
      <h2>Cartas Esperanza Data:</h2>
      <pre>{JSON.stringify(CartasEsperanzaData, null, 2)}</pre>
    </div>
  )
}

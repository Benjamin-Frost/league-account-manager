import { invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';

function App() {
  const [greetMsg, setGreetMsg] = useState('');
  const [name, setName] = useState('');

  async function greet() {
    setGreetMsg(await invoke('greet', { name }));
  }

  return (
    <>
      <h1 className="text-3xl text-amber-500">Welcome to Tauri!</h1>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>
      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
    </>
  );
}

export default App;

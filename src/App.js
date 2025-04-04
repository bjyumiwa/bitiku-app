import { useState, useEffect } from "react";
import "./styles.css";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export default function App() {
  const [items, setItems] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [expiry, setExpiry] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");

  // Firestoreからデータ読み込み
  useEffect(() => {
    const fetchItems = async () => {
      const querySnapshot = await getDocs(collection(db, "items"));
      const fetchedItems = querySnapshot.docs.map((doc) => doc.data());
      setItems(fetchedItems);
    };
    fetchItems();
  }, []);

  // Firestoreに保存
  const handleAddItem = async () => {
    const newItem = { photo, name, category, expiry, note };
    await addDoc(collection(db, "items"), newItem); // ← Firebaseに保存
    setItems([...items, newItem]); // ローカルにも反映
    setPhoto(null);
    setName("");
    setCategory("");
    setExpiry("");
    setNote("");
  };

  const today = new Date();
  const isNearExpiry = (date) => {
    const expiryDate = new Date(date);
    const diff = (expiryDate - today) / (1000 * 60 * 60 * 24);
    return diff <= 3;
  };

  const filteredItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff0f6",
        borderRadius: "20px",
        minHeight: "100vh",
      }}
    >
      <h1 style={{ color: "#d63384", textAlign: "center" }}>
        🌸 わたしの備蓄袋 🌸
      </h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="🔍 名前やカテゴリで検索"
        style={{
          margin: "20px 0",
          padding: "6px",
          width: "100%",
          borderRadius: "6px",
          border: "1px solid #ccc",
        }}
      />

      <div style={{ marginBottom: "20px" }}>
        <label>📷 写真</label>
        <br />
        <input
          type="file"
          onChange={(e) => setPhoto(URL.createObjectURL(e.target.files[0]))}
        />
        <br />
        {photo && (
          <img
            src={photo}
            alt="item"
            style={{ width: "100px", marginTop: "10px", borderRadius: "8px" }}
          />
        )}
      </div>

      <div>
        <label>📝 名前</label>
        <br />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例：クラッカー"
        />
        <br />
      </div>

      <div>
        <label>📦 カテゴリ</label>
        <br />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="例：食料"
        />
        <br />
      </div>

      <div>
        <label>📅 賞味期限</label>
        <br />
        <input
          type="date"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        />
        <br />
      </div>

      <div>
        <label>✏️ メモ</label>
        <br />
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="その他メモ"
        />
      </div>

      <button
        onClick={handleAddItem}
        style={{
          marginTop: "10px",
          background: "#f783ac",
          color: "white",
          padding: "8px 16px",
          border: "none",
          borderRadius: "8px",
        }}
      >
        登録する
      </button>

      <hr style={{ margin: "30px 0" }} />

      <h2>登録されたアイテム一覧</h2>
      {filteredItems.map((item, index) => (
        <div
          key={index}
          style={{
            background: "#ffe3ec",
            padding: "10px",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        >
          {item.photo && (
            <img
              src={item.photo}
              alt="item"
              style={{ width: "60px", borderRadius: "6px" }}
            />
          )}
          <p>
            <strong>{item.name}</strong>
          </p>
          <p>カテゴリ：{item.category}</p>
          <p>賞味期限：{item.expiry}</p>
          {isNearExpiry(item.expiry) && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              ⚠️ まもなく賞味期限！
            </p>
          )}
          <p>メモ：{item.note}</p>
          <button
            onClick={() => {
              const newItems = items.filter((_, i) => i !== index);
              setItems(newItems);
            }}
            style={{
              marginTop: "5px",
              background: "#ff6b6b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "4px 8px",
              cursor: "pointer",
            }}
          >
            🗑 削除
          </button>
        </div>
      ))}
    </div>
  );
}

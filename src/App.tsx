import { useState } from "react";
import "./App.css";

const CATEGORIES = ["전체 보기", "메인 요리", "사이드", "음료"];

const PRODUCTS = [
  { id: 1, name: "글라스 와인(화이트)", price: 7000, image: "/wine.png", category: "음료" },
  { id: 2, name: "시그니처 로제 파스타", price: 15500, image: "/rose-pasta.png", category: "메인 요리" },
  { id: 3, name: "하몽 루꼴라 샐러드", price: 12000, image: "/salad.png", category: "사이드" },
  { id: 4, name: "트러플 버섯 파스타", price: 17500, image: "/truffle-pasta.png", category: "메인 요리" },
  { id: 5, name: "착즙 오렌지 주스", price: 4000, image: "/juice.png", category: "음료" },
  { id: 6, name: "당근 퓌레 안심 스테이크", price: 21000, image: "/steak.png", category: "메인 요리" },
  { id: 7, name: "뇨끼 크림 파스타", price: 14500, image: "/gnocchi.png", category: "메인 요리" },
];

type Product = (typeof PRODUCTS)[number];
type CartLine = { id: number; quantity: number };

/* ─────────── 부품 ─────────── */

function ProductCard({
  product,
  onClick,
}: {
  product: Product;
  onClick: () => void;
}) {
  return (
    <button className="product-card" onClick={onClick}>
      <div className="product-thumb">
        <img src={product.image} alt={product.name} />
      </div>
      <div className="product-info">
        <span className="product-name">{product.name}</span>
        <span className="product-price">{product.price.toLocaleString()}원</span>
      </div>
    </button>
  );
}

function NumberButton({
  type,
  onClick,
}: {
  type: "minus" | "plus";
  onClick: () => void;
}) {
  return (
    <button
      className={`number-button ${type}`}
      onClick={onClick}
      aria-label={type === "plus" ? "수량 늘리기" : "수량 줄이기"}
    >
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <path
          fill="currentColor"
          d={
            type === "plus"
              ? "M27.2 21.0286H21.0286V27.2H18.9714V21.0286H12.8V18.9714H18.9714V12.8H21.0286V18.9714H27.2V21.0286Z"
              : "M27.2 21.0286H12.8V18.9714H27.2V21.0286Z"
          }
        />
      </svg>
    </button>
  );
}

function CartItem({
  product,
  quantity,
  onIncrease,
  onDecrease,
}: {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="cart-item">
      <div className="cart-item-info">
        <span className="cart-item-name">{product.name}</span>
        <span className="cart-item-price">{product.price.toLocaleString()}원</span>
      </div>
      <div className="quantity-control">
        <NumberButton type="minus" onClick={onDecrease} />
        <span className="quantity-value">{quantity}</span>
        <NumberButton type="plus" onClick={onIncrease} />
      </div>
    </div>
  );
}

function EmptyCart() {
  return (
    <div className="empty-cart">
      <svg
        className="empty-cart-icon"
        viewBox="0 0 67.0316 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g stroke="currentColor" strokeWidth="6.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.93579 9.93916L57.0946 13.3074L53.7261 36.8854H9.93579M63.8316 67.2L46.9891 50.3586M46.9891 67.2L63.8316 50.3586" />
          <path d="M5.17321 61.8528C3.90979 60.5894 3.2 58.8759 3.2 57.0893C3.2 55.3026 3.90979 53.5892 5.17321 52.3258C6.43664 51.0625 8.15022 50.3527 9.93697 50.3527C11.7237 50.3527 13.4373 51.0625 14.7007 52.3258C15.9642 53.5892 16.6739 55.3026 16.6739 57.0893C16.6739 58.8759 15.9642 60.5894 14.7007 61.8528C13.4373 63.1161 11.7237 63.8259 9.93697 63.8259C8.15022 63.8259 6.43664 63.1161 5.17321 61.8528Z" />
          <path d="M33.5164 50.356H9.93697V3.2H3.2" />
        </g>
      </svg>
      <div className="empty-cart-text">
        <p className="empty-cart-title">장바구니가 비어 있어요</p>
        <p className="empty-cart-desc">왼쪽에서 메뉴를 추가해 보세요</p>
      </div>
    </div>
  );
}

/* ─────────── 앱 ─────────── */

function App() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("전체 보기");

  const addToCart = (id: number) => {
    setCart((prev) => {
      if (prev.some((line) => line.id === id)) {
        return prev.map((line) =>
          line.id === id ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const decreaseQuantity = (id: number) => {
    setCart((prev) => {
      const line = prev.find((l) => l.id === id);
      if (line?.quantity === 1) {
        return prev.filter((l) => l.id !== id);
      }
      return prev.map((l) =>
        l.id === id ? { ...l, quantity: l.quantity - 1 } : l
      );
    });
  };

  const handleOrder = () => {
    setCart([]);
  };

  const visibleProducts =
    selectedCategory === "전체 보기"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.category === selectedCategory);

  const totalQuantity = cart.reduce((sum, line) => sum + line.quantity, 0);

  const totalPrice = cart.reduce((sum, line) => {
    const product = PRODUCTS.find((p) => p.id === line.id);
    return sum + (product ? product.price * line.quantity : 0);
  }, 0);

  const isEmpty = cart.length === 0;

  return (
    <div className="app">
      <header className="header">와플스튜디오</header>

      <div className="body">
        <section className="menu">
          <div className="chips">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                className={category === selectedCategory ? "chip selected" : "chip"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="product-grid">
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => addToCart(product.id)}
              />
            ))}
          </div>
        </section>

        <aside className="cart">
          <h2 className="cart-title">장바구니</h2>

          <div className="cart-list">
            {isEmpty ? (
              <EmptyCart />
            ) : (
              cart.map((line) => {
                const product = PRODUCTS.find((p) => p.id === line.id);
                if (!product) return null;
                return (
                  <CartItem
                    key={line.id}
                    product={product}
                    quantity={line.quantity}
                    onIncrease={() => addToCart(line.id)}
                    onDecrease={() => decreaseQuantity(line.id)}
                  />
                );
              })
            )}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>총 수량</span>
              <span>{totalQuantity}개</span>
            </div>
            <div className="summary-row">
              <span>총 금액</span>
              <span>{totalPrice.toLocaleString()}원</span>
            </div>
          </div>

          <button className="order-button" disabled={isEmpty} onClick={handleOrder}>
            주문하기
          </button>
        </aside>
      </div>
    </div>
  );
}

export default App;
const Footer = () => {
  return (
    <footer className="bg-[#f0f5f7] mt-12 py-10">
      <div className="max-w-7xl mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold text-[#008aa1] mb-4">BISHA Store</h2>
          <p className="text-gray-600 text-sm">A sua loja completa de eletrônicos, casa e moda online.</p>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Categorias</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Smartphones</li>
            <li>Eletrônicos</li>
            <li>Casa e Cozinha</li>
            <li>Moda</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Ajuda e Suporte</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li>Minha conta</li>
            <li>Meus pedidos</li>
            <li>Devoluções</li>
            <li>Fale conosco</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold text-gray-800 mb-4">Fique por dentro</h3>
          <p className="text-sm text-gray-600 mb-2">Receba as novidades e ofertas direto no seu email.</p>
          <div className="flex">
            <input type="email" placeholder="Seu email" className="px-3 py-2 text-sm border border-gray-300 rounded-l-md w-full focus:outline-none" />
            <button className="bg-[#008aa1] text-white px-3 py-2 rounded-r-md text-sm">Assinar</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 md:px-10 mt-8 pt-8 border-t border-gray-300 text-sm text-gray-500 flex justify-between">
        <p>© 2026 BISHA Store. Todos os direitos reservados.</p>
        <p>Feito com React + Spring Boot</p>
      </div>
    </footer>
  );
};

export default Footer;

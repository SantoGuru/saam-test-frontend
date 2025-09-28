import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import api from '../services/api';

import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import Spinner from '../components/Spinner';

const fetchProducts = async () => {
  const { data } = await api.get('/produtos');
  return data;
};

const createProduct = (newProduct) => api.post('/produtos', newProduct);
const updateProduct = (updatedProduct) => api.put(`/produtos/${updatedProduct.id}`, updatedProduct);
const deleteProduct = (productId) => api.delete(`/produtos/${productId}`);

const customModalStyles = {  content: {
    top: '50%', left: '50%', right: 'auto', bottom: 'auto',
    marginRight: '-50%', transform: 'translate(-50%, -50%)',
    border: 'none', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    padding: '0', borderRadius: '8px', width: '90%', maxWidth: '500px'
  },
  overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' } };
Modal.setAppElement('#root');

const HomePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Cliente para invalidar queries

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

 // 1. Hook useQuery para buscar os produtos
  const { data: products = [], isLoading, isError } = useQuery({
    queryKey: ['products'], 
    queryFn: fetchProducts,
  });

  // 2. Hook useMutation para todas as operações de escrita (CUD)
  const productMutation = useMutation({
    mutationFn: (productData) => {
        return productData.id ? updateProduct(productData) : createProduct(productData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['products']); // Invalida o cache e re-busca os dados
      toast.success(`Produto ${variables.id ? 'atualizado' : 'criado'} com sucesso!`);
      closeFormModal();
    },
    onError: (_, variables) => {
      toast.error(`Erro ao ${variables.id ? 'atualizar' : 'criar'} o produto.`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success('Produto excluído com sucesso!');
      closeDeleteModal();
    },
    onError: () => {
      toast.error('Erro ao excluir o produto.');
    },
  });

  // Funções de controlo dos modais (semelhantes às de antes)
  const openFormModal = (product = null) => {
    setSelectedProduct(product);
    setIsFormModalOpen(true);
  };
  const closeFormModal = () => setIsFormModalOpen(false);

  const openDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => setIsDeleteModalOpen(false);
  
  const handleFormSubmit = (productData) => {
    productMutation.mutate(productData);
  };

  const handleDeleteConfirm = () => {
    if (selectedProduct) {
        deleteMutation.mutate(selectedProduct.id);
    }
  };

  if (isError) {
    // Podemos ter um estado de erro mais robusto aqui
    return <span>Erro ao carregar os dados.</span>
  }
  
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div>
      <div className="home-header">
        <h1>Dashboard de Produtos</h1>
        <div className="header-actions">
          <button onClick={() => openFormModal()}>Adicionar Produto</button>
          <button onClick={logout} className="button-secondary">Sair</button>
        </div>
      </div>

      <div className="product-section">
        {isLoading ? (
          <Spinner />
        ) : (
          <ProductList
            products={products}
            onEdit={openFormModal}
            onDelete={openDeleteModal}
            onAddProduct={() => openFormModal()}
          />
        )}
      </div>

      {/* Modal para Adicionar/Editar Produto */}
      <Modal isOpen={isFormModalOpen} onRequestClose={closeFormModal} style={customModalStyles}>
        <div className="modal-content-wrapper">
          <ProductForm
            product={selectedProduct}
            onRequestClose={closeFormModal}
            onFormSubmit={handleFormSubmit}
            isLoading={productMutation.isPending}
          />
        </div>
      </Modal>

      {/* Modal para Confirmar Exclusão */}
      <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal} style={customModalStyles}>
        <div className="modal-content-wrapper confirmation-modal">
            <h3>Confirmar Exclusão</h3>
            <p>Tem a certeza de que deseja excluir o produto <strong>{selectedProduct?.nome}</strong>?</p>
            <div className="confirmation-actions">
                <button onClick={closeDeleteModal} className="button-secondary" disabled={deleteMutation.isPending}>Cancelar</button>
                <button onClick={handleDeleteConfirm} className="button-delete" disabled={deleteMutation.isPending}>
                    {deleteMutation.isPending ? 'A Excluir...' : 'Sim, Excluir'}
                </button>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default HomePage;
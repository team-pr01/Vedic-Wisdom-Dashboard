/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  useDeleteDocumentMutation,
  useGetAllDocumentsQuery,
} from "../../redux/Features/DataCenter/dataCenterApi";
import toast from "react-hot-toast";
import Button from "../../components/Reusable/Button/Button";
import Table from "../../components/Reusable/Table/Table";
import DeleteConfirmationModal from "../../components/Reusable/DeleteConfirmationModal/DeleteConfirmationModal";
import UploadDocument from "../../components/DataCenterPage/UploadDocument/UploadDocument";

const DataCenter = () => {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const skip = (page - 1) * limit;
  const [keyword, setKeyword] = useState<string>("");
  const [isUploadDocumentModalOpen, setIsUploadDocumentModalOpen] =
    useState<boolean>(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] =
    useState<boolean>(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const { data, isLoading, isFetching } = useGetAllDocumentsQuery({
    skip,
    limit,
    keyword,
  });
  const documents = data?.data?.documents || [];

  const [deleteDocument] = useDeleteDocumentMutation();

  const handleDeleteDocument = async () => {
    try {
      await toast.promise(deleteDocument(documentId as string).unwrap(), {
        loading: "Loading...",
        success: "Document deleted successfully!",
        error: "Failed to delete. Please try again.",
      });
    } catch (err) {
      console.error("Error deleting document:", err);
    }
  };

  const documentTheads: any[] = [
    { key: "sl", label: "SL" },
    { key: "documentId", label: "Document ID" },
    { key: "name", label: "Name" },
    { key: "pages", label: "Pages" },
    { key: "size", label: "Size" },
  ];

  const documentsTableData = documents?.map((document: any, index: number) => ({
    sl: index + 1,
    documentId: document?.document_id,

    name: <p className="font-medium">{document?.filename}</p>,
    pages: <p className="font-medium">{document?.pages}</p>,
    size: <p className="font-medium">{document?.size || "-"}</p>,
  }));

  const children = (
    <Button
      label="Upload Document"
      onClick={() => {
        setIsUploadDocumentModalOpen(true);
      }}
      className="px-3 py-2"
    />
  );

  const handleSearch = (k: string) => {
    setKeyword(k);
  };

  return (
    <div>
      <Table<any>
        title={`Documents (${documents?.length || 0})`}
        description="Manage all documents which is used to answer questions via AI."
        theads={documentTheads}
        data={documentsTableData}
        totalPages={data?.data?.meta?.totalPages || 1}
        currentPage={page}
        onPageChange={(p) => setPage(p)}
        isLoading={isLoading || isFetching}
        onSearch={handleSearch}
        limit={limit}
        setLimit={setLimit}
        children={children}
        onDeleteItem={(row: any) => {
          console.log(row);
          setDocumentId(row?.documentId);
          setShowDeleteConfirmationModal(true);
        }}
      />

      {isUploadDocumentModalOpen && (
        <UploadDocument
          isModalOpen={isUploadDocumentModalOpen}
          setIsModalOpen={setIsUploadDocumentModalOpen}
        />
      )}

      {showDeleteConfirmationModal && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteConfirmationModal(false)}
          onConfirm={handleDeleteDocument}
        />
      )}
    </div>
  );
};

export default DataCenter;

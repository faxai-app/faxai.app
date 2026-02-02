import { homeApi } from "@/api/home";
import { useUserStore } from "@/store/store";
import { Comment, Post } from "@/types";
import {
  Bookmark,
  FileText,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
  X,
} from "lucide-react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "./ui/themes/colors";

const { width } = Dimensions.get("window");

interface PostCardProps {
  post: Post;
  onUpdate?: (updatedPost: Post) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ post, onUpdate }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked || false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // Pour le carrousel d'images
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const { user } = useUserStore();

  useEffect(() => {
    console.log("Images reçues:", post.images);
    post.images.forEach((img, i) => {
      console.log(`Image ${i}:`, img.url);
    });
  }, [post]);

  const handleLike = async () => {
    const previousState = isLiked;
    const previousCount = likesCount;

    setIsLiked(!isLiked);
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

    try {
      const result = await homeApi.likePost(post.id);
      setIsLiked(result.liked);
      setLikesCount(result.count);
      onUpdate?.({ ...post, isLiked: result.liked, likesCount: result.count });
    } catch (error) {
      setIsLiked(previousState);
      setLikesCount(previousCount);
    }
  };

  const handleBookmark = async () => {
    const previousState = isBookmarked;
    setIsBookmarked(!isBookmarked);

    try {
      const result = await homeApi.bookmarkPost(post.id);
      setIsBookmarked(result.bookmarked);
    } catch (error) {
      setIsBookmarked(previousState);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvre cette ${post.type === "epreuve" ? "épreuve" : "publication"} sur Faxai : ${post.content?.substring(0, 100)}...`,
        title: "Partager via",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const openComments = async () => {
    setShowComments(true);
    setLoadingComments(true);
    try {
      const data = await homeApi.getComments(post.id);
      setComments(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComments(false);
    }
  };

  const submitComment = async () => {
    if (!newComment.trim()) return;

    try {
      const comment = await homeApi.addComment(post.id, newComment);
      setComments([comment, ...comments]);
      setNewComment("");
      onUpdate?.({ ...post, commentsCount: (post.commentsCount || 0) + 1 });
    } catch (error) {
      console.error(error);
    }
  };

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = width - 32; // 32 = padding horizontal total (16*2)
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setCurrentImageIndex(index);
  };

  const openImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setShowImageModal(true);
  };

  const renderImageCarousel = () => {
    if (post.images.length === 0) return null;

    // Si une seule image, affichage simple
    if (post.images.length === 1) {
      return (
        <TouchableOpacity
          style={styles.singleImageContainer}
          onPress={() => openImageViewer(0)}
          activeOpacity={0.9}
        >
          <Image
            source={{ uri: post.images[0].url }}
            style={styles.singleImage}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    }

    // Carrousel pour plusieurs images
    return (
      <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={post.images}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.carouselItem}
              onPress={() => openImageViewer(index)}
              activeOpacity={0.9}
            >
              <Image
                source={{ uri: item.url }}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />

        {/* Indicateurs de pagination */}
        <View style={styles.pagination}>
          {post.images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentImageIndex && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>

        {/* Compteur d'images */}
        <View style={styles.imageCounter}>
          <Text style={styles.imageCounterText}>
            {currentImageIndex + 1}/{post.images.length}
          </Text>
        </View>
      </View>
    );
  };

  const renderAttachmentIndicator = () => {
    if (!post.hasMedia || post.images.length > 0) return null; // Caché si on voit déjà les images

    return (
      <View style={styles.attachmentBar}>
        {post.pdfCount > 0 && (
          <TouchableOpacity style={styles.attachmentBadge}>
            <FileText size={16} color={colors.primary} />
            <Text style={styles.attachmentText}>{post.pdfCount} PDF</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getTypeLabel = () => {
    switch (post.type) {
      case "epreuve":
        return "ÉPREUVE";
      case "cours":
        return "COURS";
      default:
        return "POST";
    }
  };

  return (
    <>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.authorInfo}>
            <View style={styles.avatar}>
              {post.author.profilePicture ? (
                <Image
                  source={{ uri: post.author.profilePicture }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>
                  {post.author.name?.charAt(0).toUpperCase() || "?"}
                </Text>
              )}
            </View>
            <View>
              <Text style={styles.authorName}>
                {post.author.name || "Anonyme"}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.typeBadge}>{getTypeLabel()}</Text>
                <Text style={styles.date}>
                  {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity>
            <MoreHorizontal color="#666" size={20} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Text style={styles.content}>{post.content}</Text>

        {/* Images Carrousel */}
        {renderImageCarousel()}
        {renderAttachmentIndicator()}

        {/* Level Info */}
        <View style={styles.levelInfo}>
          <Text style={styles.levelText}>
            {post.level.filiere} • {post.level.annee}
            {post.level.specialisation ? ` • ${post.level.specialisation}` : ""}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
            <Heart
              size={22}
              color={isLiked ? "#ef4444" : "#fff"}
              fill={isLiked ? "#ef4444" : "transparent"}
            />
            <Text style={[styles.actionText, isLiked && styles.likedText]}>
              {likesCount > 0 ? likesCount : "J'aime"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={openComments}>
            <MessageCircle size={22} color="#fff" />
            <Text style={styles.actionText}>
              {post.commentsCount || 0} Commentaires
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleBookmark}>
            <Bookmark
              size={22}
              color={isBookmarked ? colors.primary : "#fff"}
              fill={isBookmarked ? colors.primary : "transparent"}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={handleShare}>
            <Share2 size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal Visionneuse d'images */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.imageModalContainer}>
          <TouchableOpacity
            style={styles.imageModalClose}
            onPress={() => setShowImageModal(false)}
          >
            <X color="#fff" size={28} />
          </TouchableOpacity>

          <FlatList
            data={post.images}
            horizontal
            pagingEnabled
            initialScrollIndex={selectedImageIndex}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.imageModalItem}>
                <Image
                  source={{ uri: item.url }}
                  style={styles.imageModalImage}
                  resizeMode="contain"
                />
              </View>
            )}
            keyExtractor={(item) => item.id.toString()}
          />

          <View style={styles.imageModalCounter}>
            <Text style={styles.imageModalCounterText}>
              {selectedImageIndex + 1} / {post.images.length}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Comments Modal */}
      <Modal
        visible={showComments}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowComments(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Commentaires</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <X color="#fff" size={24} />
              </TouchableOpacity>
            </View>

            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>
                      {item.userName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentAuthor}>{item.userName}</Text>
                    <Text style={styles.commentText}>{item.content}</Text>
                    <Text style={styles.commentDate}>
                      {new Date(item.createdAt).toLocaleDateString("fr-FR")}
                    </Text>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                loadingComments ? (
                  <Text style={styles.emptyText}>Chargement...</Text>
                ) : (
                  <Text style={styles.emptyText}>Aucun commentaire</Text>
                )
              }
            />

            <View style={styles.commentInputContainer}>
              <TextInput
                style={styles.commentInput}
                placeholder="Ajouter un commentaire..."
                placeholderTextColor="#666"
                value={newComment}
                onChangeText={setNewComment}
                multiline
              />
              <TouchableOpacity
                onPress={submitComment}
                disabled={!newComment.trim()}
              >
                <Send
                  color={newComment.trim() ? colors.primary : "#666"}
                  size={24}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  authorName: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 8,
  },
  typeBadge: {
    color: colors.primary,
    fontSize: 11,
    fontWeight: "700",
  },
  date: {
    color: "#666",
    fontSize: 12,
  },
  content: {
    color: "#fff",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  // Styles pour une seule image
  singleImageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 12,
  },
  singleImage: {
    width: "100%",
    height: "100%",
  },
  // Styles pour le carrousel
  carouselContainer: {
    width: "100%",
    height: 350,
    marginBottom: 12,
    position: "relative",
  },
  carouselItem: {
    width: width - 32, // Largeur écran moins padding (16*2)
    height: 350,
    paddingHorizontal: 2,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    gap: 6,
  },
  paginationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  paginationDotActive: {
    backgroundColor: colors.primary,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  imageCounter: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  // Modal visionneuse
  imageModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
    justifyContent: "center",
  },
  imageModalClose: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  imageModalItem: {
    width: width,
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageModalImage: {
    width: width,
    height: "80%",
  },
  imageModalCounter: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imageModalCounterText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  attachmentBar: {
    marginBottom: 12,
  },
  attachmentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 6,
  },
  attachmentText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  levelInfo: {
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 12,
    marginBottom: 12,
  },
  levelText: {
    color: "#666",
    fontSize: 12,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingTop: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: "#fff",
    fontSize: 13,
  },
  likedText: {
    color: "#ef4444",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1a1a1a",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  commentItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  commentAvatarText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentAuthor: {
    color: "#fff",
    fontWeight: "600",
    marginBottom: 2,
  },
  commentText: {
    color: "#ccc",
    fontSize: 14,
    lineHeight: 20,
  },
  commentDate: {
    color: "#666",
    fontSize: 11,
    marginTop: 4,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 12,
    gap: 12,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: "#fff",
    maxHeight: 100,
  },
  emptyText: {
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  },
});

import { useState } from 'react';
import { Send, Paperclip, X, FileText, Image, Download, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Comment {
  id: number;
  projectId: number;
  author: { 
    id: string;
    name: string; 
    avatar: string; 
    role: string;
  };
  content: string;
  timestamp: string;
  attachments?: Array<{ 
    id: string;
    name: string; 
    size: string; 
    type: 'image' | 'file';
    url: string;
  }>;
  isEdited?: boolean;
}

interface CommentProjectProps {
  projectId: number;
  projectName: string;
  comments: Comment[];
  currentUser: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  onAddComment: (projectId: number, content: string, attachments?: File[]) => void;
  onEditComment: (commentId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export const CommentProject = ({
  projectId,
  projectName,
  comments,
  currentUser,
  onAddComment,
  onEditComment,
  onDeleteComment
}: CommentProjectProps) => {
  const [newComment, setNewComment] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitComment = async () => {
    if (!newComment.trim() && attachments.length === 0) return;
    
    setIsSubmitting(true);
    try {
      await onAddComment(projectId, newComment, attachments.length > 0 ? attachments : undefined);
      setNewComment('');
      setAttachments([]);
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: number) => {
    if (!editContent.trim()) return;
    
    try {
      await onEditComment(commentId, editContent);
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Failed to edit comment:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files].slice(0, 5)); // Max 5 files
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;
    
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatFileSize = (size: string) => {
    const bytes = parseInt(size);
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const startEditing = (comment: Comment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-700/50">
        <h3 className="text-xl font-semibold text-white mb-1">Project Comments</h3>
        <p className="text-slate-400">{projectName}</p>
      </div>

      {/* Comments List */}
      <ScrollArea className="h-96">
        <div className="space-y-4 pr-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="p-4 bg-slate-800/30 border-slate-700/50">
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 border border-slate-600">
                    <AvatarImage src={comment.author.avatar} />
                    <AvatarFallback className="bg-slate-700 text-slate-300 text-xs">
                      {comment.author.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 space-y-2">
                    {/* Author Info */}
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-white text-sm">{comment.author.name}</span>
                      <Badge variant="outline" className="text-xs bg-slate-700/50 text-slate-300 border-slate-600">
                        {comment.author.role}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatTime(comment.timestamp)}
                        {comment.isEdited && (
                          <span className="ml-1 text-slate-500">(edited)</span>
                        )}
                      </div>
                    </div>

                    {/* Comment Content */}
                    {editingComment === comment.id ? (
                      <div className="space-y-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          className="bg-slate-800/50 border-slate-600 text-white resize-none"
                          rows={3}
                        />
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleEditComment(comment.id)}
                            className="bg-cyan-600 hover:bg-cyan-700"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={cancelEditing}
                            className="text-slate-400 hover:text-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>
                        
                        {/* Attachments */}
                        {comment.attachments && comment.attachments.length > 0 && (
                          <div className="mt-3 space-y-2">
                            {comment.attachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center gap-2 p-2 bg-slate-800/50 rounded border border-slate-700/50"
                              >
                                {attachment.type === 'image' ? (
                                  <Image className="w-4 h-4 text-cyan-400" />
                                ) : (
                                  <FileText className="w-4 h-4 text-slate-400" />
                                )}
                                <span className="text-sm text-slate-300 flex-1">{attachment.name}</span>
                                <span className="text-xs text-slate-500">{formatFileSize(attachment.size)}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0 text-slate-400 hover:text-cyan-400"
                                >
                                  <Download className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Actions */}
                    {comment.author.id === currentUser.id && editingComment !== comment.id && (
                      <div className="flex items-center gap-2 text-xs">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => startEditing(comment)}
                          className="h-6 px-2 text-slate-400 hover:text-cyan-400"
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onDeleteComment(comment.id)}
                          className="h-6 px-2 text-slate-400 hover:text-red-400"
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* New Comment Form */}
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Avatar className="w-8 h-8 border border-slate-600">
            <AvatarImage src={currentUser.avatar} />
            <AvatarFallback className="bg-slate-700 text-slate-300 text-xs">
              {currentUser.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 space-y-3">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-slate-800/50 border-slate-700/50 text-white placeholder:text-slate-400 resize-none focus:border-cyan-500"
              rows={3}
            />

            {/* Attachments Preview */}
            {attachments.length > 0 && (
              <div className="space-y-2">
                {attachments.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 bg-slate-800/30 rounded border border-slate-700/30"
                  >
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-300 flex-1">{file.name}</span>
                    <span className="text-xs text-slate-500">{formatFileSize(file.size.toString())}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeAttachment(index)}
                      className="h-6 w-6 p-0 text-slate-400 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  id="comment-files"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => document.getElementById('comment-files')?.click()}
                  className="text-slate-400 hover:text-cyan-400 hover:bg-slate-700/50"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <span className="text-xs text-slate-500">
                  Max 5 files, 10MB each
                </span>
              </div>

              <Button
                onClick={handleSubmitComment}
                disabled={(!newComment.trim() && attachments.length === 0) || isSubmitting}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
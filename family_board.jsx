import React, { useState, useEffect } from 'react';
import { Send, LogOut, Trash2 } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function FamilyBoard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // LocalStorageからデータを読み込む
  useEffect(() => {
    const savedPosts = localStorage.getItem('familyBoardPosts');
    if (savedPosts) {
      try {
        const parsedPosts = JSON.parse(savedPosts);
        setPosts(parsedPosts.map(post => ({
          ...post,
          timestamp: new Date(post.timestamp)
        })));
      } catch (error) {
        console.error('データの読み込みに失敗しました:', error);
      }
    }
  }, []);

  // postsが変更されたときにLocalStorageに保存
  useEffect(() => {
    localStorage.setItem('familyBoardPosts', JSON.stringify(posts));
  }, [posts]);

  // パスワード「2222」をSHA256でハッシュ化した値
  const HASHED_PASSWORD = '90273de2a3318eb5e17e5cb8bef99262558eb3bac74c7269f948d5e76da91e39';
  const FAMILY_MEMBERS = [
    { id: 'K', name: 'K' },
    { id: 'Y', name: 'Y' },
    { id: 'M', name: 'M' }
  ];

  const handleLogin = () => {
    const hashedInput = CryptoJS.SHA256(passwordInput).toString();
    if (hashedInput === HASHED_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordInput('');
    } else {
      alert('パスワードが間違っています。もう一度お試しください。');
      setPasswordInput('');
    }
  };

  const handlePostSubmit = () => {
    if (!newPost.trim()) {
      alert('メッセージを入力してください');
      return;
    }
    if (!authorName.trim()) {
      alert('記入者を選択してください');
      return;
    }

    const post = {
      id: Date.now(),
      author: authorName.trim(),
      content: newPost.trim(),
      timestamp: new Date()
    };

    setPosts([post, ...posts]);
    setNewPost('');
  };

  const handleDelete = (id) => {
    setPosts(posts.filter(post => post.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    setNewPost('');
    setAuthorName('');
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '今たった今';
    if (minutes < 60) return `${minutes}分前`;
    if (hours < 24) return `${hours}時間前`;
    if (days < 7) return `${days}日前`;

    return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-neutral-900 border border-yellow-600/30 rounded-2xl p-8 shadow-2xl text-center">
            <h1 className="text-4xl font-bold text-yellow-500 mb-8">
              Family Board
            </h1>

            <div className="space-y-4">
              <div>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="パスワードを入力"
                  className="w-full px-5 py-3 bg-neutral-800 border border-yellow-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white placeholder-gray-500 transition-all"
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                />
              </div>

              <button
                onClick={handleLogin}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300"
              >
                入る
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-2xl mx-auto">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-8 pt-6">
          <h1 className="text-3xl font-bold text-yellow-500">
            Family Board
          </h1>
          <button
            onClick={handleLogout}
            className="p-2 text-yellow-500 hover:text-yellow-400 transition-colors"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>

        {/* 投稿作成フォーム */}
        <div className="bg-neutral-900 border border-yellow-600/30 rounded-lg p-6 mb-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                記入者のイニシャル。
              </label>
              <div className="flex gap-4">
                {FAMILY_MEMBERS.map((member) => (
                  <label key={member.id} className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="author"
                      value={member.id}
                      checked={authorName === member.id}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="w-4 h-4 accent-yellow-500"
                    />
                    <span className="ml-2 px-3 py-1 text-sm font-semibold text-white bg-neutral-800 border border-yellow-600/30 rounded">
                      {member.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">
                メッセージ
              </label>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-800 border border-yellow-600/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-white resize-none h-24"
              />
            </div>

            <button
              onClick={handlePostSubmit}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              投稿する
            </button>
          </div>
        </div>

        {/* 投稿一覧 */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="bg-neutral-900 border border-yellow-600/30 rounded-lg p-8 text-center">
              <p className="text-gray-400">メッセージはまだありません</p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="bg-neutral-900 border border-yellow-600/30 rounded-lg p-6 hover:border-yellow-500/50 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-yellow-500 mb-1">
                      {post.author}
                    </div>
                    <div className="text-xs text-gray-500">{formatTime(post.timestamp)}</div>
                  </div>

                  {showDeleteConfirm === post.id && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-black text-xs font-semibold rounded transition-all"
                      >
                        削除
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(null)}
                        className="px-3 py-1 bg-neutral-700 hover:bg-neutral-600 text-white text-xs rounded transition-all"
                      >
                        キャンセル
                      </button>
                    </div>
                  )}
                  {showDeleteConfirm !== post.id && (
                    <button
                      onClick={() => setShowDeleteConfirm(post.id)}
                      className="p-2 text-gray-500 hover:text-yellow-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
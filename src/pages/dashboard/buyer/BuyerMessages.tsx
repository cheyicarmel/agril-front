import { useState, useEffect, useRef } from 'react'
import { useConversations, useConversation, useSendMessage } from '../../../hooks/useMessages'
import { useAuthStore } from '../../../store/authStore'

export default function BuyerMessages() {
  const { user } = useAuthStore()
  const { data: conversations, isLoading } = useConversations()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: conversation, isLoading: convLoading } = useConversation(selectedId ?? 0)
  const { mutate: sendMessage, isPending: sending } = useSendMessage()

  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedId) {
      setSelectedId(conversations[0].id)
    }
  }, [conversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversation?.messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedId) return
    sendMessage(
      { conversationId: selectedId, content: message.trim() },
      { onSuccess: () => setMessage('') }
    )
  }

  return (
    <div style={{ maxWidth: '100%' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
          fontWeight: 700,
          color: 'var(--color-text)',
          letterSpacing: '-0.025em',
          marginBottom: '0.35rem',
        }}>
          Messages
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
          {conversations?.length ?? 0} conversation{(conversations?.length ?? 0) !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        background: 'white',
        borderRadius: '20px',
        border: '1px solid var(--color-border)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-sm)',
        height: 'calc(100svh - 220px)',
        minHeight: '480px',
      }} className="messages-grid">

        {/* Liste conversations */}
        <div style={{ borderRight: '1px solid #F0F0F0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #F0F0F0', flexShrink: 0 }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Mes conversations
            </p>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {isLoading ? (
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: '64px', borderRadius: '10px', background: '#F5F5F5', opacity: 0.6 - i * 0.1 }} />
                ))}
              </div>
            ) : conversations?.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 300, marginBottom: '1rem' }}>
                  Aucune conversation.
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-text-light)', fontWeight: 300 }}>
                  Contactez un producteur depuis la page d'une exploitation.
                </p>
              </div>
            ) : (
              conversations?.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  style={{
                    width: '100%', padding: '0.875rem 1rem',
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    background: selectedId === conv.id ? 'var(--color-primary-light)' : 'transparent',
                    border: 'none', borderBottom: '1px solid #F5F5F5',
                    cursor: 'pointer', textAlign: 'left',
                    transition: 'background 0.15s', fontFamily: 'var(--font-body)',
                  }}
                  onMouseEnter={(e) => { if (selectedId !== conv.id) e.currentTarget.style.background = '#FAFAFA' }}
                  onMouseLeave={(e) => { if (selectedId !== conv.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', fontSize: '0.875rem',
                    fontWeight: 700, color: 'white', flexShrink: 0,
                  }}>
                    {conv.farm?.name?.charAt(0).toUpperCase() ?? '?'}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                      <p style={{
                        fontSize: '0.82rem', fontWeight: 600,
                        color: selectedId === conv.id ? 'var(--color-primary)' : 'var(--color-text)',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {conv.farm?.name ?? 'Exploitation'}
                      </p>
                      {(conv.unread_count ?? 0) > 0 && (
                        <span style={{
                          width: '16px', height: '16px', borderRadius: '50%',
                          background: 'var(--color-primary)', color: 'white',
                          fontSize: '0.6rem', fontWeight: 700,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize: '0.7rem', color: 'var(--color-text-muted)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontWeight: (conv.unread_count ?? 0) > 0 ? 500 : 300,
                    }}>
                      {conv.last_message?.content ?? 'Nouvelle conversation'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Zone messages */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selectedId ? (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: '0.75rem',
            }}>
              <div style={{
                width: '52px', height: '52px', borderRadius: '16px',
                background: 'var(--color-primary-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M19 13.5a1 1 0 01-1 1H7L3.5 18V4.5a1 1 0 011-1H18a1 1 0 011 1V13.5z" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
                Sélectionnez une conversation
              </p>
            </div>
          ) : (
            <>
              <div style={{
                padding: '1rem 1.25rem', borderBottom: '1px solid #F0F0F0',
                display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0,
              }}>
                {convLoading ? (
                  <div style={{ height: '20px', width: '120px', borderRadius: '6px', background: '#F0F0F0' }} />
                ) : (
                  <>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px',
                      background: 'linear-gradient(135deg, var(--color-primary) 0%, #2D9B6A 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: 'var(--font-display)', fontSize: '0.875rem',
                      fontWeight: 700, color: 'white',
                    }}>
                      {conversation?.farm?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text)' }}>
                        {conversation?.farm?.name ?? 'Exploitation'}
                      </p>
                      <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
                        {conversation?.farm?.city ?? ''}, {conversation?.farm?.department ?? ''}
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {convLoading ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[1, 2, 3].map(i => (
                      <div key={i} style={{
                        height: '48px', borderRadius: '12px', background: '#F5F5F5',
                        width: i % 2 === 0 ? '60%' : '45%',
                        alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                        opacity: 0.5,
                      }} />
                    ))}
                  </div>
                ) : conversation?.messages?.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', fontWeight: 300 }}>
                      Démarrez la conversation.
                    </p>
                  </div>
                ) : (
                  conversation?.messages?.map((msg) => {
                    const isMe = msg.sender?.id === user?.id
                    return (
                      <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                          maxWidth: '70%', padding: '0.6rem 0.875rem',
                          borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                          background: isMe ? 'var(--color-primary)' : '#F5F5F5',
                          color: isMe ? 'white' : 'var(--color-text)',
                          fontSize: '0.875rem', lineHeight: 1.55, fontWeight: 300,
                        }}>
                          <p>{msg.content}</p>
                          <p style={{
                            fontSize: '0.62rem',
                            color: isMe ? 'rgba(255,255,255,0.55)' : 'var(--color-text-light)',
                            marginTop: '0.25rem',
                            textAlign: isMe ? 'right' : 'left',
                          }}>
                            {new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSend} style={{
                padding: '0.875rem', borderTop: '1px solid #F0F0F0',
                display: 'flex', gap: '0.5rem', flexShrink: 0,
              }}>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  style={{
                    flex: 1, padding: '0.75rem 1rem',
                    borderRadius: '100px', border: '1.5px solid #E8E8E8',
                    background: '#F8F8F8', fontSize: '0.875rem',
                    fontFamily: 'var(--font-body)', color: 'var(--color-text)',
                    outline: 'none', transition: 'border-color 0.15s, background 0.15s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.background = 'white' }}
                  onBlur={(e) => { e.target.style.borderColor = '#E8E8E8'; e.target.style.background = '#F8F8F8' }}
                />
                <button
                  type="submit"
                  disabled={sending || !message.trim()}
                  style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: sending || !message.trim() ? '#D4D4D4' : 'var(--color-primary)',
                    border: 'none',
                    cursor: sending || !message.trim() ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.15s', flexShrink: 0,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M14 8L2 2l3 6-3 6 12-6z" fill="white"/>
                  </svg>
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
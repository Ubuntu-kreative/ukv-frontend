from pathlib import Path

root = Path(r'C:\Users\SEI\Ubuntu-Kreative-Village\ukv-frontend')
component_path = root / 'src' / 'components' / 'moxie' / 'MoxieChat.tsx'
css_path = root / 'src' / 'components' / 'moxie' / 'MoxieChat.module.css'

text = component_path.read_text(encoding='utf-8')

text = text.replace('{messages.length === 0 && (', '{messages.length === 0 ? (', 2)

old_msg_block = """{messages.map((msg, i) => (
\t\t\t\t\t\t<div key={i} className={`${styles.messageRow} ${msg.role === 'user' ? styles.messageUser : styles.messageBot}`}>
\t\t\t\t\t\t\t<div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot}`}>
\t\t\t\t\t\t\t\t{msg.content}
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</div>
\t\t\t\t\t))}"""
new_msg_block = """{messages.map((msg, i) => (
\t\t\t\t\t\t<motion.div
\t\t\t\t\t\t\tkey={i}
\t\t\t\t\t\t\tinitial={{ opacity: 0, y: 8 }}
\t\t\t\t\t\t\tanimate={{ opacity: 1, y: 0 }}
\t\t\t\t\t\t\ttransition={{ duration: 0.18, ease: 'easeOut' }}
\t\t\t\t\t\t\tclassName={`${styles.messageRow} ${msg.role === 'user' ? styles.messageUser : styles.messageBot}`}
\t\t\t\t\t\t>
\t\t\t\t\t\t\t<div className={`${styles.messageBubble} ${msg.role === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot}`}>
\t\t\t\t\t\t\t\t{msg.content}
\t\t\t\t\t\t\t</div>
\t\t\t\t\t\t</motion.div>
\t\t\t\t\t))}"""
text = text.replace(old_msg_block, new_msg_block, 2)

old_closing = """\t\t\t\t\t)}\n\t\t\t\t</div>\n\n\t\t\t\t<div className={styles.inputWrap}>"""
new_closing = """\t\t\t\t\t)}\n\t\t\t\t\t<div ref={messagesEndRef} />\n\t\t\t\t</div>\n\n\t\t\t\t<div className={styles.inputWrap}>"""
text = text.replace(old_closing, new_closing, 2)

component_path.write_text(text, encoding='utf-8')

css_text = css_path.read_text(encoding='utf-8')
if '.typingIndicator' not in css_text:
    insert_marker = '  color: #f5f0e8;\n'  # inside .messageBubbleUser
    css_text = css_text.replace(
        insert_marker,
        insert_marker + "\n.typingIndicator {\n  display: inline-block;\n  width: 10px;\n  height: 10px;\n  margin-right: 8px;\n  border-radius: 999px;\n  background: rgba(255,255,255,0.8);\n  box-shadow: 0 0 0 rgba(255,255,255,0.8);\n  animation: moxieTyping 1.2s infinite ease-in-out;\n}\n\n@keyframes moxieTyping {\n  0%, 100% { transform: scale(0.75); opacity: 0.35; }\n  50% { transform: scale(1); opacity: 1; }\n}\n",
        1,
    )
    css_path.write_text(css_text, encoding='utf-8')

print('patched')

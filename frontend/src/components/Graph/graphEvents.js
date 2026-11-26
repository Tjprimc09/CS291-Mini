export default function graphEvents(
    cy,
    pending,
    selection,
    setHovered,
    setClickedNodes,
    setBusy,
    setError,
    setResult,
    setState,
    setStart,
    setEnd) {
        cy.on('mouseover', 'node', event => {
                    setHovered(event.target.id())
                })
        
                cy.on('mouseout', 'node', () => {
                    setHovered(null)
                })
        
                cy.on('tap', 'node', event => {
                    const id = event.target.id()
        
                    setClickedNodes(previous =>
                        previous.includes(id)
                            ? previous.filter(node => node !== id)
                            : [...previous, id]
                    )
        
                    pending.current?.abort()
        
                    setBusy(false)
                    setError('')
                    setResult(null)
                    setState('')
        
                    const current = selection.current
        
                    if (!current.start || current.end) {
                        setStart(id)
                        setEnd('')
                    } else if (id !== current.start) {
                        setEnd(id)
                    }
                })
    }

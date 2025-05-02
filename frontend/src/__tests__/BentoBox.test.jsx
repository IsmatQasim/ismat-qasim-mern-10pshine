import { render, screen, fireEvent } from '@testing-library/react'
import { expect, test, vi, describe } from 'vitest'
import BentoBox from '../components/BentoBox'
import '@testing-library/jest-dom'


describe('BentoBox Component', () => {

  test('renders BentoBox with title and paragraph', () => {
    render(<BentoBox title="My Bento Box" paragraph="This is a description" width="200px" height="100px" />)
    expect(screen.getByText('My Bento Box')).toBeInTheDocument()
    expect(screen.getByText('This is a description')).toBeInTheDocument()
  })

  test('renders BentoBox with icon if provided', () => {
    render(<BentoBox title="Bento" icon="🍱" />)
    expect(screen.getByText('🍱')).toBeInTheDocument()  
  })

  test('fires onClick event when clicked', () => {
    const handleClick = vi.fn()  
    render(<BentoBox title="Click me" onClick={handleClick} />)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1) 
  })

})

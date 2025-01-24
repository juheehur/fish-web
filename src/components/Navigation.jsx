import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaFish } from 'react-icons/fa';
import { MdOutlineMap, MdOutlineCamera, MdOutlineScience, MdOutlineNewspaper } from 'react-icons/md';

const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  padding: 12px 0;
  z-index: 1000;
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
`;

const NavItem = styled.li`
  text-align: center;
`;

const NavLink = styled(Link)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: ${props => props.$isActive ? '#2B6CB0' : '#718096'};
  font-size: 12px;
  gap: 6px;
  transition: all 0.2s;
  padding: 8px 0;
  
  &:hover {
    color: #2B6CB0;
  }

  span {
    margin-top: 4px;
  }
`;

const IconWrapper = styled.div`
  width: ${props => props.$isCamera ? '60px' : '32px'};
  height: ${props => props.$isCamera ? '60px' : '32px'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$isCamera ? '#2B6CB0' : 'transparent'};
  border-radius: ${props => props.$isCamera ? '50%' : '0'};
  margin-top: ${props => props.$isCamera ? '-30px' : '0'};
  transition: transform 0.2s;

  &:hover {
    transform: ${props => props.$isCamera ? 'scale(1.05)' : 'scale(1.1)'};
  }

  svg {
    width: ${props => props.$isCamera ? '30px' : '28px'};
    height: ${props => props.$isCamera ? '30px' : '28px'};
    fill: ${props => props.$isCamera ? '#FFFFFF' : 'currentColor'};
  }
`;

const Navigation = () => {
  const location = useLocation();
  
  return (
    <Nav>
      <NavList>
        <NavItem>
          <NavLink to="/fishtank" $isActive={location.pathname === '/fishtank'}>
            <IconWrapper>
              <FaFish />
            </IconWrapper>
            <span>Fish Tank</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink to="/map" $isActive={location.pathname === '/map'}>
            <IconWrapper>
              <MdOutlineMap />
            </IconWrapper>
            <span>Map</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink to="/" $isActive={location.pathname === '/'}>
            <IconWrapper $isCamera>
              <MdOutlineCamera />
            </IconWrapper>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink to="/research" $isActive={location.pathname === '/research'}>
            <IconWrapper>
              <MdOutlineScience />
            </IconWrapper>
            <span>Research</span>
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink to="/news" $isActive={location.pathname === '/news'}>
            <IconWrapper>
              <MdOutlineNewspaper />
            </IconWrapper>
            <span>News</span>
          </NavLink>
        </NavItem>
      </NavList>
    </Nav>
  );
};

export default Navigation; 
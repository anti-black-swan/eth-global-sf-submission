import { NextPage } from 'next'
import DepositComponent from '../components/connected/deposit';
import styles from '../styles/Home.module.css';


const Deposit: NextPage = () => {
    return(
        <div>
            <div className={styles.depositinput}>            
                <DepositComponent />
            </div>
        </div>
        
    )
}

export default Deposit;

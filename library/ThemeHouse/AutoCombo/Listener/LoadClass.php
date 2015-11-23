<?php

class ThemeHouse_AutoCombo_Listener_LoadClass extends ThemeHouse_Listener_LoadClass
{

    protected function _getExtendedClasses()
    {
        return array(
            'ThemeHouse_AutoCombo' => array(
                'controller' => array(
                    'ThemeHouse_AutoCombo_ControllerPublic_Member'
                ), /* END 'controller' */
            ), /* END 'ThemeHouse_AutoCombo' */
        );
    } /* END _getExtendedClasses */

    public static function loadClassController($class, array &$extend)
    {
        $loadClassController = new ThemeHouse_AutoCombo_Listener_LoadClass($class, $extend, 'controller');
        $extend = $loadClassController->run();
    } /* END loadClassController */
}